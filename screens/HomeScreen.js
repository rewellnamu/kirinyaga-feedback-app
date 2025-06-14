import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';

const BACKGROUND_IMAGE = require('../assets/image.png');
const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.18 }}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Public Feedback</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('New Report')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Submit New Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('All Reports')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>View All Reports</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  title: {
    fontSize: width < 400 ? 28 : 34,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 40,
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: '#eaf0fb',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
  },
  button: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#007bff',
    paddingVertical: width < 400 ? 13 : 16,
    borderRadius: 12,
    marginBottom: 22,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: width < 400 ? 17 : 19,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
