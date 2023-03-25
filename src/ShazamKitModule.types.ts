/**
 * An object that represents the metadata for a matched reference signature.
 */
export type MatchedItem = {
  /**
   * A title for the media item.
   */
  title?: string;
  /**
   * The name of the artist for the media item, such as the performer of a song.
   */
  artist?: string;
  /**
   * The Shazam ID for the song.
   */
  shazamID?: string;
  /**
   * The Apple Music ID for the song.
   */
  appleMusicID?: string;
  /**
   * A link to the Apple Music page that contains the full information for the song.
   */
  appleMusicURL?: string;
  /**
   * The URL for artwork for the media item, such as an album cover.
   */
  artworkURL?: string;
  /**
   * An array of genre names for the media item.
   */
  genres: string[];
  /**
   * A link to the Shazam Music catalog page that contains the full information for the song.
   */
  webURL?: string;
  /**
   * The Apple Music ID for the song.
   */
  subtitle?: string;
  /**
   * The URL for a video for the media item, such as a music video.
   */
  videoURL?: string | null;
  /**
   * A Boolean value that indicates whether the media item contains explicit content.
   */
  explicitContent: boolean;
  /**
   * The timecode in the reference recording that matches the start of the query, in seconds.
   */
  matchOffset: number;
};
