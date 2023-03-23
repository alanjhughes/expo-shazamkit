import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

import ExpoShazamKit from "./ShazamKitModule";
import { ChangeEventPayload, MatchedItem } from "./ShazamKitModule.types";

const emitter = new EventEmitter(
  ExpoShazamKit ?? NativeModulesProxy.ExpoShazamKit
);

export async function startListening(): Promise<MatchedItem[]> {
  return await ExpoShazamKit.startListening();
}

export function stopListening() {
  ExpoShazamKit.stopListening();
}

export function addChangeListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export { ChangeEventPayload };
