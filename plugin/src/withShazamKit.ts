import { ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins";

const pkg = require("expo-shazamkit/package.json");

const MICROPHONE_USAGE = "Allow $(PRODUCT_NAME) to access your microphone";

const withShazamKit: ConfigPlugin<{
  microphonePermission?: string;
}> = (config, { microphonePermission } = {}) => {
  if (!config.ios) config.ios = {};
  if (!config.ios.infoPlist) config.ios.infoPlist = {};
  config.ios.infoPlist.NSMicrophoneUsageDescription =
    microphonePermission ||
    config.ios.infoPlist.NSMicrophoneUsageDescription ||
    MICROPHONE_USAGE;

  return config;
};

export default createRunOncePlugin(withShazamKit, pkg.name, pkg.version);
