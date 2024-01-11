import ExpoModulesCore
import ShazamKit

public class ShazamKitModule: Module, ResultHandler {
  private let session = SHSession()
  private var delegate: ShazamDelegate?
  
  private let audioEngine = AVAudioEngine()
  private let mixerNode = AVAudioMixerNode()
  
  private var pendingPromise: Promise?
  
  private var latestResults = [SHMediaItem]()
  
  public func definition() -> ModuleDefinition {
    Name("ExpoShazamKit")
    
    OnCreate {
      delegate = ShazamDelegate(resultHandler: self)
      session.delegate = delegate
      configureAudioEngine()
    }
    
    Function("isAvailable") {
      return true
    }
    
    AsyncFunction("startListening") { (promise: Promise) in
      if pendingPromise != nil {
        promise.reject(SearchInProgressException())
        return
      }
      
      pendingPromise = promise
      
      do {
        try findMatch()
      } catch {
        promise.reject(error)
        pendingPromise = nil
      }
    }
    
    AsyncFunction("addToShazamLibrary") { (promise: Promise) in
      if latestResults.isEmpty {
        promise.resolve(["success": false])
        return
      }
      
      SHMediaLibrary.default.add(latestResults) { [weak self] error in
        if error != nil {
          promise.resolve(["success": false])
        }
        
        self?.latestResults.removeAll()
        promise.resolve(["success": true])
      }
    }
    
    Function("stopListening") {
      stopListening()
    }
  }
  
  func didFind(match: SHMatch) {
    guard let promise = pendingPromise else {
      log.error("Shazam module: promise has been lost")
      stopListening()
      return
    }
    
    stopListening()
    
    let items = match.mediaItems.map { item in
      MatchedItem(
        title: item.title,
        artist: item.artist,
        shazamID: item.shazamID,
        appleMusicID: item.appleMusicID,
        appleMusicURL: item.appleMusicURL?.absoluteString,
        artworkURL: item.artworkURL?.absoluteString,
        genres: item.genres,
        webURL: item.webURL?.absoluteString,
        subtitle: item.subtitle,
        videoURL: item.videoURL?.absoluteString,
        explicitContent: item.explicitContent,
        matchOffset: Double(item.matchOffset.description) ?? 0.0
      )
    }
    
    latestResults = match.mediaItems
    promise.resolve(items)
  }
  
  func didNotFind(match: SHSignature) {
    guard let promise = pendingPromise else {
      log.error("ExpoShazamKit: promise has been lost")
      return
    }
    
    promise.reject(NoMatchException())
    stopListening()
  }
  
  private func findMatch() throws {
    guard !audioEngine.isRunning else { return }
    let audioSession = AVAudioSession.sharedInstance()
    try audioSession.setCategory(.playAndRecord)
    
    audioSession.requestRecordPermission { [weak self] success in
      guard success, let self else { return }
      do {
        try self.audioEngine.start()
      } catch {
        self.pendingPromise?.reject(FailedToStartAudioEngine())
        self.pendingPromise = nil
      }
    }
  }
  
  private func stopListening() {
    audioEngine.stop()
    pendingPromise = nil
  }
  
  private func configureAudioEngine() {
    let inputFormat = audioEngine.inputNode.inputFormat(forBus: 0)
    let outputFormat = AVAudioFormat(standardFormatWithSampleRate: inputFormat.sampleRate, channels: 1)
    
    audioEngine.attach(mixerNode)
    
    audioEngine.connect(audioEngine.inputNode, to: mixerNode, format: inputFormat)
    audioEngine.connect(mixerNode, to: audioEngine.outputNode, format: outputFormat)
    
    mixerNode.installTap(onBus: 0, bufferSize: 2048, format: outputFormat) { buffer, audioTime in
      self.addAudio(buffer: buffer, audioTime: audioTime)
    }
  }
  
  private func addAudio(buffer: AVAudioPCMBuffer, audioTime: AVAudioTime) {
    session.matchStreamingBuffer(buffer, at: audioTime)
  }
}
