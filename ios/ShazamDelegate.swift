import ShazamKit

protocol ResultHandler {
    func didFind(match: SHMatch)
    func didNotFind(match: SHSignature)
}

class ShazamDelegate: NSObject, SHSessionDelegate {
    private let resultHandler: ResultHandler
    
    init(resultHandler: ResultHandler) {
        self.resultHandler = resultHandler
    }
    
    func session(_ session: SHSession, didFind match: SHMatch) {
        resultHandler.didFind(match: match)
    }
    
    func session(_ session: SHSession, didNotFindMatchFor signature: SHSignature, error: Error?) {
        resultHandler.didNotFind(match: signature)
    }
}


