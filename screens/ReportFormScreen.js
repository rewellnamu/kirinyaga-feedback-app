import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Dimensions, Platform, ScrollView, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/api';

const { width } = Dimensions.get('window');
const BACKGROUND_IMAGE = require('../assets/image.png');

export default function ReportFormScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Roads');
  const [ward, setWard] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState(null); // store image object
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pick image from device
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // Upload image to backend
  const uploadImage = async () => {
    if (!image) return '';
    const formData = new FormData();
    if (Platform.OS === 'web') {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const file = new File([blob], image.fileName || 'photo.jpg', { type: blob.type });
      formData.append('file', file);
    } else {
      formData.append('file', {
        uri: image.uri,
        name: image.fileName || 'photo.jpg',
        type: image.type || 'image/jpeg',
      });
    }
    const uploadRes = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return uploadRes.data.url;
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    // Validate required fields
    if (!title.trim() || !category.trim() || !ward.trim()) {
      setErrorMsg('Title, Category, and Ward are required.');
      Alert.alert('Validation Error', 'Title, Category, and Ward are required.');
      return;
    }
    setLoading(true);
    try {
      let finalImageUrl = imageUrl;
      if (image) {
        finalImageUrl = await uploadImage();
        setImageUrl(finalImageUrl);
      }
      const payload = {
        title,
        description,
        category,
        ward,
        contact,
        imageUrl: finalImageUrl,
        location: {
          type: 'Point',
          coordinates: [0, 0] // Default coordinates; replace with real values if available
        }
      };
      console.log('Submitting payload:', payload);
      const res = await api.post('/reports', payload);
      Alert.alert('Success', 'Report submitted');
      navigation.navigate('Home'); // changed from 'All Reports' to 'Home'
    } catch (err) {
      const backendMsg = err.response?.data?.message || JSON.stringify(err.response?.data) || err.message || 'Unknown error';
      setErrorMsg(backendMsg);
      console.error('Submission error:', backendMsg, err);
      Alert.alert('Error', backendMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.18 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      >
        <View style={styles.formWrapper}>
          <Text style={styles.header}>Submit a Report</Text>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            // Remove error clearing here
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            multiline
            // Remove error clearing here
          />
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.input}
          >
            <Picker.Item label="Roads" value="Roads" />
            <Picker.Item label="Water" value="Water" />
            <Picker.Item label="Security" value="Security" />
            <Picker.Item label="Electricity" value="Electricity" />
            <Picker.Item label="Health" value="Health" />
            <Picker.Item label="Agriculture" value="Agriculture" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
          <TextInput
            placeholder="Ward"
            value={ward}
            onChangeText={setWard}
            style={styles.input}
            // Remove error clearing here
          />
          <TextInput
            placeholder="Contact (optional)"
            value={contact}
            onChangeText={setContact}
            style={styles.input}
            // Remove error clearing here
          />
          {/* Image upload UI */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.85}>
            <Text style={styles.imagePickerText}>{image ? 'Change Image' : 'Pick an Image (optional)'}</Text>
          </TouchableOpacity>
          {image && (
            <Image source={{ uri: image.uri }} style={styles.preview} />
          )}
          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <View style={styles.buttonWrapper}>
              <Button title="Submit Report" onPress={handleSubmit} color="#007bff" />
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute', // Ensure background covers the whole screen
    top: 0,
    left: 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    paddingVertical: 24,
    // Remove backgroundColor here to avoid covering the image
  },
  formWrapper: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: 'rgba(255,255,255,0.98)', // keep for form contrast
    borderRadius: 18,
    padding: width < 400 ? 18 : 28,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 3,
    alignSelf: 'center',
    marginVertical: 24,
  },
  header: {
    fontSize: width < 400 ? 22 : 26,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    padding: width < 400 ? 10 : 14,
    marginBottom: 14,
    borderRadius: 9,
    fontSize: width < 400 ? 15 : 17,
    backgroundColor: '#f8fafd',
    color: '#222',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#eaf0fb',
  },
  imagePickerText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: width < 400 ? 15 : 16,
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: width < 400 ? 13 : 15,
  },
  buttonWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 2,
  },
});
