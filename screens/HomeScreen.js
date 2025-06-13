import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Submit New Report" onPress={() => navigation.navigate('New Report')} />
      <Button title="View All Reports" onPress={() => navigation.navigate('All Reports')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', gap: 20, padding: 20
  }
});
