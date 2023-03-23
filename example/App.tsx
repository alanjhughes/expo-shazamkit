import * as ShazamKitModule from "expo-shazamkit";
import { MatchedItem } from "expo-shazamkit/ShazamKitModule.types";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function App() {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<MatchedItem[]>([]);

  const startListening = async () => {
    try {
      setSearching(true);
      const result = await ShazamKitModule.startListening();
      setSearching(false);
      setResults(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {searching && <ActivityIndicator color="red" />}
      <Button
        title="Try Shazam"
        disabled={searching}
        onPress={startListening}
      />
      <Button
        title="Stop Listening"
        disabled={!searching}
        onPress={() => {
          ShazamKitModule.stopListening();
          setSearching(false);
        }}
      />

      <FlatList
        data={results}
        ListHeaderComponent={() => <Text>Results</Text>}
        contentContainerStyle={{ padding: 10 }}
        keyExtractor={(item) => item.shazamID}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image
              source={{ uri: item.artworkURL }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text>Title: {item.title}</Text>
              <Text>Artist: {item.artist}</Text>
              <Text>Explicit: {item.explicitContent ? "True" : "False"}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 44,
  },
  row: {
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    padding: 10,
    gap: 20,
  },
});
