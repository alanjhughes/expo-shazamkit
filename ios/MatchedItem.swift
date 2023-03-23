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
    var webURL: URL? = nil
    @Field
    var subtitle: String? = nil
    @Field
    var videoURL: String? = nil
    @Field
    var explicitContent: Bool = false
    @Field
    var matchOffset: Double = 0.0
}


//"title": item.title ?? "",
//"artist": item.artist ?? "",
//"shazamID": item.shazamID ?? "",
//"appleMusicID": item.appleMusicID ?? "",
//"appleMusicURL": item.appleMusicURL ?? "",
//"genres": item.genres,
//"webURL": item.webURL ?? "",
//"subtitle": item.subtitle ?? "",
//"artworkURL": item.artworkURL?.absoluteString ?? "",
//"videoURL": item.videoURL ?? "",
//"explicitContent": item.explicitContent,
//"matchOffset": Double(item.matchOffset.description) ?? 0.0,
