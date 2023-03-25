import * as Linking from "expo-linking";
import * as ExpoShazamKit from "expo-shazamkit";
import { MatchedItem } from "expo-shazamkit";
import { MotiView } from "moti";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function App() {
  const [searching, setSearching] = useState(false);
  const [song, setSong] = useState<MatchedItem | null>(null);

  const startListening = async () => {
    try {
      if (song) {
        setSong(null);
      }
      setSearching(true);
      const result = await ExpoShazamKit.startListening();
      setSearching(false);
      if (result.length > 0) {
        setSong(result[0]);
      }
    } catch {
      setSearching(false);
    }
  };

  const addToShazamLibrary = async () => {
    const result = await ExpoShazamKit.addToShazamLibrary();

    if (result.success) {
      Alert.alert("Success", "Song added to Shazam Library");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", gap: 10 }}>
        {song && (
          <MotiView
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "timing",
              duration: 500,
              scale: { type: "spring" },
            }}
            style={styles.item}
          >
            <Image
              source={{ uri: song.artworkURL }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 0.4)",
              }}
            />
            <View style={{ alignItems: "center", gap: 10 }}>
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                {song.title}
              </Text>
              <Text
                style={{ fontSize: 18, textAlign: "center", fontWeight: "600" }}
              >
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
              <Button
                title="Add to Shazam Library"
                onPress={addToShazamLibrary}
              />
            </View>
          </MotiView>
        )}
      </View>

      {searching && (
        <View style={{ alignItems: "center", marginVertical: 20, gap: 10 }}>
          <ActivityIndicator color="white" size="large" />
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Listening...
          </Text>
        </View>
      )}

      <View style={{ gap: 20 }}>
        <Pressable
          style={{
            alignItems: "center",
          }}
          onPress={startListening}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.btn,
                {
                  backgroundColor: !searching ? "white" : "lightgray",
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.btnText,
                  {
                    color: "rgb(74, 111, 250)",
                  },
                ]}
              >
                Tap to Shazam
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={{
            alignItems: "center",
          }}
          disabled={!searching}
          onPress={() => {
            ExpoShazamKit.stopListening();
            if (searching) {
              setSearching(false);
            }
          }}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.btn,
                {
                  backgroundColor: !searching ? "lightgray" : "red",
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.btnText,
                  {
                    color: "white",
                  },
                ]}
              >
                Stop
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(74, 111, 250)",
    paddingBottom: 50,
  },
  item: {
    alignItems: "center",
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    padding: 10,
    gap: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    width: 200,
  },
  btnText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
