import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Image, TouchableOpacity, Platform, ImageBackground, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/api';

const BACKGROUND_IMAGE = require('../assets/image.png');
const { width } = Dimensions.get('window');

export default function ReportFormScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Roads');
  const [ward, setWard] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      navigation.navigate('All Reports');
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.formWrapper}>
            <Text style={styles.header}>Submit a Report</Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              placeholderTextColor="#888"
            />
            <Picker
              selectedValue={category}
              onValueChange={setCategory}
              style={styles.input}
              itemStyle={{ fontSize: width < 400 ? 15 : 17 }}
            >
              <Picker.Item label="Roads" value="Roads" />
              <Picker.Item label="Water" value="Water" />
              <Picker.Item label="Security" value="Security" />
              <Picker.Item label="Electricity" value="Electricity" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
            <TextInput
              placeholder="Ward"
              value={ward}
              onChangeText={setWard}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Contact (optional)"
              value={contact}
              onChangeText={setContact}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.85}>
              <Text style={styles.imagePickerText}>{image ? 'Change Image' : 'Pick an Image (optional)'}</Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image.uri }} style={styles.preview} />
            )}
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
            {loading ? (
              <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 10 }} />
            ) : (
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.85}>
                <Text style={styles.submitButtonText}>Submit Report</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 16,
    padding: width < 400 ? 18 : 28,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 2,
    alignSelf: 'center',
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
    padding: width < 400 ? 9 : 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: width < 400 ? 15 : 17,
    backgroundColor: '#f8fafd',
    color: '#222',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
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
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: width < 400 ? 13 : 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 2,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: width < 400 ? 16 : 18,
    letterSpacing: 0.5,
  },
});
