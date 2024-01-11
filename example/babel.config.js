const path = require("path");
/* global __dirname */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".tsx", ".ts", ".js", ".json"],
          alias: {
            // For development, we want to alias the library to the source
            "expo-shazamkit": path.join(__dirname, "..", "src", "index.ts"),
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
