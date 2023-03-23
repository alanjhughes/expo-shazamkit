import ExpoShazamKit from "./ShazamKitModule";
import { MatchedItem } from "./ShazamKitModule.types";

export async function startListening(): Promise<MatchedItem[]> {
  return await ExpoShazamKit.startListening();
}

export function stopListening() {
  ExpoShazamKit.stopListening();
}
