import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { addDoc, collection, doc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import AppCard from '../components/AppCard';
import { useAuth } from '../context/AuthContext';
import { db, serverTimestamp } from '../services/firebase';

export default function HomeScreen() {
  const [apps, setApps] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();

  useEffect(() => onSnapshot(collection(db, 'apps'), (snap) => {
    setApps(snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((a) => a.status !== 'rejected'));
  }), []);

  const recalcRating = async (appId) => {
    const ratingsSnap = await getDocs(collection(db, 'apps', appId, 'ratings'));
    const values = ratingsSnap.docs.map((d) => d.data().value || 0);
    const ratingCount = values.length;
    const ratingAvg = ratingCount ? values.reduce((a, b) => a + b, 0) / ratingCount : 0;
    await updateDoc(doc(db, 'apps', appId), { ratingAvg, ratingCount });
  };

  const rate = async (appId, value) => {
    if (!user) return;
    await setDoc(doc(db, 'apps', appId, 'ratings', user.uid), {
      value,
      userId: user.uid,
      userName: user.displayName,
      updatedAt: serverTimestamp()
    });
    await recalcRating(appId);
  };

  const comment = async (appId, text) => {
    if (!user) return;
    await addDoc(collection(db, 'apps', appId, 'comments'), {
      text,
      userId: user.uid,
      userName: user.displayName,
      userPhoto: user.photoURL,
      createdAt: serverTimestamp()
    });

    const commentsSnap = await getDocs(collection(db, 'apps', appId, 'comments'));
    await updateDoc(doc(db, 'apps', appId), { commentsCount: commentsSnap.size });
  };

  const filteredApps = selectedCategory === 'all' ? apps : apps.filter((a) => a.category === selectedCategory);

  return (
    <View style={styles.wrap}>
      <View style={styles.filters}>
        {[
          { key: 'all', label: 'الكل' },
          { key: 'games', label: 'ألعاب' },
          { key: 'productivity', label: 'إنتاجية' },
          { key: 'education', label: 'تعليم' }
        ].map((f) => (
          <TouchableOpacity key={f.key} style={[styles.filterBtn, selectedCategory === f.key && styles.filterBtnActive]} onPress={() => setSelectedCategory(f.key)}>
            <Text style={[styles.filterTxt, selectedCategory === f.key && styles.filterTxtActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredApps}
        numColumns={2}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <AppCard item={item} onRate={rate} onComment={comment} />}
      />
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, backgroundColor: '#000', padding: 6 }, filters: { flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' }, filterBtn: { backgroundColor: '#222', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }, filterBtnActive: { backgroundColor: '#ffa726' }, filterTxt: { color: '#fff' }, filterTxtActive: { color: '#000', fontWeight: '700' } });
