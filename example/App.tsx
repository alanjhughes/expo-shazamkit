import * as ExpoShazamKit from "expo-shazamkit";
import { MatchedItem } from "expo-shazamkit/ShazamKitModule.types";
import { useState } from "react";
import {
  ActivityIndicator,
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
        console.log(result[0]);
        setSong(result[0]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ gap: 20 }}>
        <Pressable
          style={{
            alignItems: "center",
          }}
          onPress={startListening}
        >
          {({ pressed }) => (
            <View
              style={{
                alignItems: "center",
                backgroundColor: !searching ? "white" : "lightgray",
                padding: 10,
                borderRadius: 10,
                width: 200,
                opacity: pressed ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "rgb(74, 111, 250)",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
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
              style={{
                alignItems: "center",
                backgroundColor: !searching ? "lightgray" : "red",
                padding: 10,
                borderRadius: 10,
                width: 200,
                opacity: pressed ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Stop
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {searching && (
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <ActivityIndicator color="white" size="large" />
          <Text style={{ color: "white" }}>Listening...</Text>
        </View>
      )}

      {song && (
        <View style={styles.row}>
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
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>
              {song.title}
            </Text>
            <Text style={{ fontSize: 18 }}>{song.artist}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(74, 111, 250)",
    paddingTop: 50,
  },
  row: {
    alignItems: "center",
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    padding: 10,
    gap: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  startBtn: {},
});
