import ExpoModulesCore

internal class SearchInProgressException: Exception {
  override var reason: String {
    "Search is already in progress. Please cancel current search and try again"
  }
}

internal class NoMatchException: Exception {
    override var reason: String {
        "Could not find a match"
    }
}
