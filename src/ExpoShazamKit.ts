import { NativeModulesProxy } from "expo-modules-core";

export default NativeModulesProxy.ExpoShazamKit || {
  isAvailable(): boolean {
    return false;
  },

  startListening() {
    throw new Error("ExpoShazamKit is not available on Android.");
  },

  stopListening() {
    throw new Error("ExpoShazamKit is not available on Android.");
  },

  addToShazamLibrary() {
    return { success: false };
  },

  addListener() {
    // Nothing to do; unsupported platform.
    return Promise.resolve();
  },

  removeListeners() {
    // Nothing to do; unsupported platform.
    return Promise.resolve();
  },
};
