package expo.community.modules.shazamkit

import android.Manifest
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.util.Log
import androidx.annotation.RequiresPermission
import androidx.annotation.WorkerThread
import com.shazam.shazamkit.Catalog
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.nio.ByteBuffer

class ShazamKitModule : Module() {
    private val context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

    override fun definition() = ModuleDefinition {
        Name("ExpoShazamKit")

        AsyncFunction("startListening") { promise: Promise ->
            Log.d("Shazam", "Start Listening")
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
