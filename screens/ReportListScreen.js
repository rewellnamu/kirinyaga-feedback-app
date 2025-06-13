import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import api from '../api/api';

export default function ReportListScreen() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get('/reports').then(res => setReports(res.data));
  }, []);

  return (
    <View>
      <FlatList
        data={reports}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}
