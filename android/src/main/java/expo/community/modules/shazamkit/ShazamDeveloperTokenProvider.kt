package expo.community.modules.shazamkit

import com.shazam.shazamkit.DeveloperToken
import com.shazam.shazamkit.DeveloperTokenProvider

class ShazamDeveloperTokenProvider : DeveloperTokenProvider {
    override fun provideDeveloperToken() = DeveloperToken(token = "")
}