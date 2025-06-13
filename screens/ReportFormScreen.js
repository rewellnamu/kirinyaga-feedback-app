import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/api';

export default function ReportFormScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Roads');
  const [ward, setWard] = useState('');
  const [contact, setContact] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    setErrorMsg('');
    // Validate required fields
    if (!title.trim() || !category.trim() || !ward.trim()) {
      setErrorMsg('Title, Category, and Ward are required.');
      Alert.alert('Validation Error', 'Title, Category, and Ward are required.');
      return;
    }
    setLoading(true);
    const payload = {
      title,
      description,
      category,
      ward,
      contact,
      imageUrl,
      location: {
        type: 'Point',
        coordinates: [0, 0] // Default coordinates; replace with real values if available
      }
    };
    console.log('Submitting payload:', payload);
    try {
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
    <View style={styles.container}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} multiline />
      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={styles.input}
      >
        <Picker.Item label="Roads" value="Roads" />
        <Picker.Item label="Water" value="Water" />
        <Picker.Item label="Security" value="Security" />
        <Picker.Item label="Electricity" value="Electricity" />
        <Picker.Item label="Other" value="Other" />
      </Picker>
      <TextInput placeholder="Ward" value={ward} onChangeText={setWard} style={styles.input} />
      <TextInput placeholder="Contact (optional)" value={contact} onChangeText={setContact} style={styles.input} />
      <TextInput placeholder="Image URL (optional)" value={imageUrl} onChangeText={setImageUrl} style={styles.input} />
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button title="Submit Report" onPress={handleSubmit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5
  },
  error: {
    color: 'red',
    marginBottom: 10
  }
});
