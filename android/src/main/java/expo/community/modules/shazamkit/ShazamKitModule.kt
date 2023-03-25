package expo.community.modules.shazamkit

import android.Manifest
import android.content.pm.PackageManager
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.util.Log
import androidx.annotation.RequiresPermission
import androidx.annotation.WorkerThread
import androidx.core.app.ActivityCompat
import com.shazam.shazamkit.*
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.nio.ByteBuffer
import java.util.*

class ShazamKitModule : Module() {
    private val context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

    override fun definition() = ModuleDefinition {
        Name("ExpoShazamKit")

        AsyncFunction("startListening") Coroutine { promise: Promise ->
            val catalog = ShazamKit.createShazamCatalog(ShazamDeveloperTokenProvider(), locale = Locale.getDefault())

            when (val session = ShazamKit.createStreamingSession(catalog = catalog, AudioSampleRateInHz.SAMPLE_RATE_16000, DEFAULT_BUFFER_SIZE)) {
                is ShazamKitResult.Success -> {
                    if (ActivityCompat.checkSelfPermission(
                            context,
                            Manifest.permission.RECORD_AUDIO
                        ) != PackageManager.PERMISSION_GRANTED
                    ) {
                        promise.resolve(null)
                    } else {
                        session.data.matchStream(simpleMicRecording(catalog), Int.SIZE_BYTES, 12000)
                        session.data.recognitionResults().collect { result ->
                           when(result) {
                               is MatchResult.Match -> {
                                   val results = result.matchedMediaItems.map {
                                        MatchedItem(
                                            title = it.title,
                                            artist = it.artist,
                                            shazamID = it.shazamID,
                                            appleMusicID = it.appleMusicID,
                                            appleMusicURL = it.appleMusicURL?.toString().orEmpty(),
                                            artworkURL = it.artworkURL?.toString().orEmpty(),
                                            genres = it.genres,
                                            webURL = it.webURL?.toString().orEmpty(),
                                            subtitle = it.subtitle,
                                            videoURL = it.videoURL?.toString().orEmpty(),
                                            explicitContent = it.explicitContent ?: false,
                                            matchOffset = it.matchOffsetInMs?.toDouble() ?: 0.0
                                        )
                                   }
                                   promise.resolve(results)
                               }
                               is MatchResult.NoMatch -> {
                                    promise.reject(NoMatchException())
                               }
                               is MatchResult.Error -> {
                                    promise.reject("MatchResult Error", result.exception.message, result.exception.cause)
                               }
                           }
                        }
                    }
                }
                is ShazamKitResult.Failure -> {
                    promise.reject("Shazam Error", "Failed to start recording", session.reason)
                }
            }
        }

        Function("stopListening") {
            Log.d("Shazam", "Stop Listening")
        }
    }

    @RequiresPermission(Manifest.permission.RECORD_AUDIO)
    @WorkerThread
    private fun simpleMicRecording(catalog: Catalog): ByteArray {
        val audioSource = MediaRecorder.AudioSource.UNPROCESSED

        val audioFormat = AudioFormat.Builder()
            .setChannelMask(AudioFormat.CHANNEL_IN_MONO)
            .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
            .setSampleRate(48_000)
            .build()

        val audioRecord = AudioRecord.Builder()
            .setAudioSource(audioSource)
            .setAudioFormat(audioFormat)
            .build()

        val seconds = catalog.maximumQuerySignatureDurationInMs

        // Final desired buffer size to allocate 12 seconds of audio
        val size = audioFormat.sampleRate * audioFormat.encoding.toByteAllocation() * seconds
        val destination = ByteBuffer.allocate(size.toInt())

        // Small buffer to retrieve chunks of audio
        val bufferSize = AudioRecord.getMinBufferSize(
            48_000,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        )

        audioRecord.startRecording()
        val readBuffer = ByteArray(bufferSize)

        while (destination.remaining() > 0) {
            val actualRead = audioRecord.read(readBuffer, 0, bufferSize)
            val byteArray = readBuffer.sliceArray(0 until actualRead)
            destination.putTrimming(byteArray)
        }
        audioRecord.release()
        return destination.array()
    }

    private fun Int.toByteAllocation(): Int {
        return when (this) {
            AudioFormat.ENCODING_PCM_16BIT -> 2
            else -> throw IllegalArgumentException("Unsupported encoding")
        }
    }

    private fun ByteBuffer.putTrimming(byteArray: ByteArray) {
        if (byteArray.size <= this.capacity() - this.position()) {
            this.put(byteArray)
        } else {
            this.put(byteArray, 0, this.capacity() - this.position())
        }
    }
}
