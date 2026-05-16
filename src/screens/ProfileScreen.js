import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [myApps, setMyApps] = useState([]);
  useEffect(() => {
    if (!user) return;
    return onSnapshot(query(collection(db, 'apps'), where('ownerId', '==', user.uid)), (snap) => setMyApps(snap.docs));
  }, [user]);
  if (!user) return null;
  return <View style={styles.c}><Image source={{ uri: user.photoURL }} style={styles.p} /><Text style={styles.t}>{user.displayName}</Text><Text style={styles.tx}>{user.email}</Text><Text style={styles.tx}>UID: {user.uid}</Text><Text style={styles.tx}>Uploaded apps: {myApps.length}</Text></View>;
}
const styles = StyleSheet.create({ c: { flex: 1, backgroundColor: '#111', alignItems: 'center', padding: 20 }, p: { width: 90, height: 90, borderRadius: 50 }, t: { color: '#ffa726', fontSize: 20, marginTop: 12 }, tx: { color: '#eee', marginTop: 6 } });
