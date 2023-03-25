package expo.community.modules.shazamkit

import expo.modules.kotlin.exception.CodedException

class SearchInProgressException :
    CodedException("Search is already in progress. Please cancel current search and try again")

class NoMatchException :
    CodedException("Could not find a match")