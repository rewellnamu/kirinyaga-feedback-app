import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet, Dimensions, Modal, Pressable, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import api from '../api/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

// You can use a local image (require) or a remote URL
const BACKGROUND_IMAGE = require('../assets/image.png'); // Place your image in the assets folder

export default function ReportListScreen() {
  const [reports, setReports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [commentInputs, setCommentInputs] = useState({}); // { [reportId]: commentText }

  useEffect(() => {
    api.get('/reports').then(res => setReports(res.data));
  }, []);

  const openImage = (url) => {
    setModalImageUrl(url);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalImageUrl('');
  };

  const handleCommentChange = (reportId, text) => {
    setCommentInputs(inputs => ({ ...inputs, [reportId]: text }));
  };

  const submitComment = async (reportId) => {
    const text = commentInputs[reportId];
    if (!text || !text.trim()) return;
    try {
      await api.post(`/reports/${reportId}/comments`, { text });
      // Refresh reports after comment
      const res = await api.get('/reports');
      setReports(res.data);
      setCommentInputs(inputs => ({ ...inputs, [reportId]: '' }));
    } catch (err) {
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.18 }}
    >
      <View style={styles.container}>
        <FlatList
          data={reports}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="file-document-outline" size={22} color="#007bff" />
                <Text style={styles.cardHeaderText}>Report</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                {item.imageUrl ? (
                  <TouchableOpacity onPress={() => openImage(item.imageUrl)} activeOpacity={0.8}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : null}
                <View style={styles.footer}>
                  <Text style={styles.status}>Status: <Text style={styles[item.status?.replace(' ', '').toLowerCase()] || styles.statusDefault}>{item.status}</Text></Text>
                  <Text style={styles.ward}>{item.ward}</Text>
                </View>
                {/* Comments Section */}
                <View style={styles.commentsSection}>
                  <View style={styles.commentsDivider} />
                  <Text style={styles.commentsTitle}>Comments</Text>
                  {item.comments && item.comments.length > 0 ? (
                    item.comments.map((comment, idx) => (
                      <View key={idx} style={styles.commentRow}>
                        <View style={styles.avatar}>
                          <MaterialCommunityIcons name="account-circle" size={28} color="#bbb" />
                        </View>
                        <View style={styles.commentBubble}>
                          <Text style={styles.commentText}>{comment.text}</Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noComments}>No comments yet.</Text>
                  )}
                  <View style={styles.commentInputRow}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Add a comment..."
                      value={commentInputs[item._id] || ''}
                      onChangeText={text => handleCommentChange(item._id, text)}
                      placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity
                      style={styles.commentButton}
                      onPress={() => submitComment(item._id)}
                    >
                      <MaterialCommunityIcons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <Pressable style={styles.modalOverlay} onPress={closeModal}>
            <Image
              source={{ uri: modalImageUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </Pressable>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: width < 400 ? 6 : 12,
  },
  listContent: {
    paddingBottom: width < 400 ? 16 : 28,
    paddingHorizontal: width < 400 ? 2 : 10,
  },
  cardWrapper: {
    marginBottom: width < 400 ? 18 : 28,
    borderRadius: 16,
    backgroundColor: '#eaf0fb',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
    padding: width < 400 ? 1 : 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: width < 400 ? 8 : 14,
    paddingTop: width < 400 ? 7 : 10,
    paddingBottom: width < 400 ? 1 : 2,
  },
  cardHeaderText: {
    fontWeight: 'bold',
    color: '#007bff',
    marginLeft: 6,
    fontSize: width < 400 ? 14 : 16,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: width < 400 ? 10 : 16,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: width < 400 ? 16 : 19,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  description: {
    fontSize: width < 400 ? 13 : 15,
    color: '#444',
    marginBottom: 8,
    marginTop: 2,
  },
  image: {
    width: width - (width < 400 ? 32 : 52),
    height: width < 400 ? 120 : 180,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#eaeaea',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    marginTop: 2,
  },
  status: {
    fontSize: width < 400 ? 12 : 14,
    fontWeight: '600',
  },
  open: {
    color: '#007bff',
  },
  inprogress: {
    color: '#ff9800',
  },
  resolved: {
    color: '#28a745',
  },
  statusDefault: {
    color: '#888',
  },
  ward: {
    fontSize: width < 400 ? 11 : 13,
    color: '#888',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    borderRadius: 16,
    backgroundColor: '#222',
  },
  commentsSection: {
    marginTop: width < 400 ? 8 : 14,
    paddingTop: width < 400 ? 6 : 10,
    borderTopWidth: 1,
    borderTopColor: '#e3e3e3',
    backgroundColor: '#f8fafd',
    borderRadius: 10,
    paddingHorizontal: width < 400 ? 3 : 6,
    paddingBottom: width < 400 ? 5 : 8,
  },
  commentsDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: width < 400 ? 5 : 8,
    borderRadius: 1,
  },
  commentsTitle: {
    fontWeight: 'bold',
    marginBottom: width < 400 ? 3 : 6,
    color: '#007bff',
    fontSize: width < 400 ? 13 : 15,
    letterSpacing: 0.1,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: width < 400 ? 3 : 6,
    marginLeft: 2,
  },
  avatar: {
    marginRight: 7,
    marginTop: 1,
  },
  commentBubble: {
    backgroundColor: '#eef3fb',
    borderRadius: 8,
    paddingVertical: width < 400 ? 4 : 6,
    paddingHorizontal: width < 400 ? 8 : 12,
    maxWidth: '85%',
  },
  commentText: {
    fontSize: width < 400 ? 12 : 14,
    color: '#333',
    lineHeight: width < 400 ? 16 : 19,
  },
  noComments: {
    fontSize: width < 400 ? 11 : 13,
    color: '#aaa',
    fontStyle: 'italic',
    marginBottom: 4,
    marginLeft: 4,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: width < 400 ? 6 : 10,
    marginLeft: 2,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: width < 400 ? 6 : 8,
    marginRight: 8,
    fontSize: width < 400 ? 12 : 14,
    backgroundColor: '#fff',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  commentButton: {
    backgroundColor: '#007bff',
    paddingVertical: width < 400 ? 6 : 8,
    paddingHorizontal: width < 400 ? 10 : 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
});
