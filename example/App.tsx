import { StyleSheet, Text, View } from 'react-native';

import * as ShazamKitModule from 'expo-shazamkit';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ShazamKitModule.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
