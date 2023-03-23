import ExpoModulesCore

internal struct MatchedItem: Record {
    @Field
    var title: String? = nil
    @Field
    var artist: String? = nil
    @Field
    var shazamID: String? = nil
    @Field
    var appleMusicID: String? = nil
    @Field
    var appleMusicURL: String? = nil
    @Field
    var artworkURL: String? = nil
    @Field
    var genres: [String] = []
    @Field
    var webURL: String? = nil
    @Field
    var subtitle: String? = nil
    @Field
    var videoURL: String? = nil
    @Field
    var explicitContent: Bool = false
    @Field
    var matchOffset: Double = 0.0
}
