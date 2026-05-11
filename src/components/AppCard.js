import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AppCard({ item, onRate, onComment }) {
  const [comment, setComment] = useState('');

  const submitComment = async () => {
    if (!comment.trim()) return;
    await onComment(item.id, comment.trim());
    setComment('');
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.iconUrl }} style={styles.icon} />
      <Text style={styles.title}>{item.name}</Text>
      <Text numberOfLines={2} style={styles.desc}>{item.shortDescription}</Text>
      <Text style={styles.owner}>👤 {item.ownerName}</Text>

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => onRate(item.id, n)}>
            <Text>⭐</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.meta}>⭐ {item.ratingAvg?.toFixed?.(1) || '0.0'} ({item.ratingCount || 0})</Text>
      <Text style={styles.meta}>💬 {item.commentsCount || 0}</Text>

      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="اكتب تعليق"
        placeholderTextColor="#888"
        style={styles.input}
      />
      <TouchableOpacity style={styles.btn} onPress={submitComment}>
        <Text style={styles.btnText}>إرسال تعليق</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#1f1f1f', margin: 6, borderRadius: 12, padding: 10 },
  icon: { width: '100%', height: 110, borderRadius: 8 },
  title: { color: '#ffa726', fontWeight: '700', marginTop: 8 },
  desc: { color: '#ddd', fontSize: 12 },
  owner: { color: '#bbb', marginTop: 4 },
  starsRow: { flexDirection: 'row', gap: 4, marginTop: 8 },
  meta: { color: '#ccc', fontSize: 12, marginTop: 4 },
  input: { backgroundColor: '#2a2a2a', color: '#fff', borderRadius: 8, padding: 8, marginTop: 8, fontSize: 12 },
  btn: { backgroundColor: '#ffa726', borderRadius: 8, paddingVertical: 7, marginTop: 6, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: '700', fontSize: 12 }
});
