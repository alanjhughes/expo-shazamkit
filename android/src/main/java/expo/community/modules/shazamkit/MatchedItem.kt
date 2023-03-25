package expo.community.modules.shazamkit

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class MatchedItem(
    @Field
    var title: String?,
    @Field
    var artist: String?,
    @Field
    var shazamID: String?,
    @Field
    var appleMusicID: String?,
    @Field
    var appleMusicURL: String?,
    @Field
    var artworkURL: String?,
    @Field
    var genres: List<String> = emptyList(),
    @Field
    var webURL: String,
    @Field
    var subtitle: String?,
    @Field
    var videoURL: String?,
    @Field
    var explicitContent: Boolean = false,
    @Field
    var matchOffset: Double = 0.0
) : Record