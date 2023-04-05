# Expo Shazamkit

Shazam for React Native

## Preview

https://user-images.githubusercontent.com/30924086/229935589-ef3e60ae-10f0-4e0d-aebf-a0ce06d8dba2.mov

# Installation

```sh
npx expo install expo-shazamkit
```

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

## Configuration for iOS 🍏

> This is only required for usage in bare React Native apps.

Run `npx pod-install` after installing the npm package.

Add the following to your `Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>$(PRODUCT_NAME) would like to access your microphone</string>
```

## Activate the ShazamKit service

On your apple developer account page, under `Certificates, Identifiers & Profiles` select `Identifiers`. If you have already created an identifier for your app, select it. If not, create a new one. Under `App Services` enable `ShazamKit`.

### Plugin

You need to request access to the microphone to record audio. You can use the plugin to set the message you would like or use the default `Allow $(PRODUCT_NAME) to access your microphone`.

`app.json`

```json
{
  "plugins": [
    "expo-shazamkit",
    {
      "microphonePermission": "Your permission message"
    }
  ]
}
```

## Usage

```ts
import * as Linking from "expo-linking";
import * as ExpoShazamKit from "expo-shazamkit";

// ...
const [searching, setSearching] = useState(false);
const [song, setSong] = useState<MatchedItem | null>(null);

const startListening = async () => {
  try {
    if (song) {
      setSong(null);
    }

    setSearching(true);
    const result = await ExpoShazamKit.startListening();
    if (result.length > 0) {
      setSong(result[0]);
    } else {
      Alert.alert("No Match", "No songs found");
    }

    setSearching(false);
  } catch (error: any) {
    if (error instanceof Error) {
      Alert.alert("Error", error.message);
    }
    setSearching(false);
  }
};

<View>
  {song && (
    <View style={styles.song}>
      <Image
        source={{ uri: song.artworkURL }}
        style={{
          width: 150,
          height: 150,
        }}
      />
      <View style={{ alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{song.title}</Text>
        <Text style={{ fontSize: 18, textAlign: "center", fontWeight: "600" }}>
          {song.artist}
        </Text>

        <View style={{ flexDirection: "row" }}>
          <Button
            title="Apple Music"
            onPress={() => Linking.openURL(song.appleMusicURL ?? "")}
          />
          <Button
            title="Shazam"
            onPress={() => Linking.openURL(song.webURL ?? "")}
          />
        </View>
        <Button title="Add to Shazam Library" onPress={addToShazamLibrary} />
      </View>
    </View>
  )}
  <Button title="Start listening" onPress={startListening} />
</View>;
```

### Available methods

| Name                 | Description                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| `isAvailable`        | Returns a boolean indicating if the library is available on the current platform                          |
| `startListening`     | async. Returns an array of matches. Usually only contains a single item                                   |
| `stopListening`      | Stop the recording                                                                                        |
| `addToShazamLibrary` | async. Adds the most recently discovered item to the users Shazam library. returns `{ success: boolean }` |

# Contributing

Contributions are welcome!
