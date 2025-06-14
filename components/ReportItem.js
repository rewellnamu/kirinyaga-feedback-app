import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Modal, Pressable, TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const statusColors = {
  open: '#007bff',
  inprogress: '#ff9800',
  resolved: '#28a745',
  default: '#888'
};

const IMAGE_MAX_WIDTH = 400;
const IMAGE_HORIZONTAL_MARGIN = 60;
const imageWidth = Math.min(screenWidth - IMAGE_HORIZONTAL_MARGIN, IMAGE_MAX_WIDTH);
const imageHeight = Math.round(imageWidth * 9 / 16);

const ReportItem = ({ title, description, imageUrl, status, ward }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: statusColors[status?.replace(' ', '').toLowerCase()] || statusColors.default }
          ]}>
            <Text style={styles.statusBadgeText}>{status}</Text>
          </View>
        </View>
        <Text style={styles.ward}>{ward}</Text>
        <View style={styles.divider} />
        {imageUrl ? (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setModalVisible(true)}
              style={{ width: '100%', maxWidth: IMAGE_MAX_WIDTH, alignSelf: 'center' }}
            >
              <Image
                source={{ uri: imageUrl }}
                style={[
                  styles.image,
                  { width: '100%', maxWidth: IMAGE_MAX_WIDTH, height: imageHeight }
                ]}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <Modal
              visible={modalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </Pressable>
            </Modal>
          </>
        ) : (
          <View style={[
            styles.imagePlaceholder,
            { width: '100%', maxWidth: IMAGE_MAX_WIDTH, height: imageHeight }
          ]}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
        <Text style={styles.description} numberOfLines={4}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 24,
    marginHorizontal: 6,
    borderRadius: 20,
    overflow: 'hidden',
    // Gradient background simulation
    backgroundColor: '#f7fafd',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1a2233',
    flex: 1,
    marginRight: 10,
    letterSpacing: 0.2,
  },
  statusBadge: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  ward: {
    fontSize: 15,
    color: '#5a5a5a',
    fontStyle: 'italic',
    marginBottom: 8,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
    borderRadius: 1,
  },
  image: {
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: '#eaeaea',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 120,
    maxWidth: IMAGE_MAX_WIDTH,
  },
  imagePlaceholder: {
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 120,
    maxWidth: IMAGE_MAX_WIDTH,
  },
  imagePlaceholderText: {
    color: '#bbb',
    fontSize: 16,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 2,
    lineHeight: 23,
    marginTop: 2,
    fontWeight: '400',
    letterSpacing: 0.1,
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
});

export default ReportItem;
