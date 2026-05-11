import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db, serverTimestamp } from '../services/firebase';

export default function ChatScreen() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  useEffect(() => onSnapshot(query(collection(db, 'chat'), orderBy('createdAt', 'desc')), (s) => setMessages(s.docs.map((d) => d.data()))), []);
  const send = async () => {
    if (!text.trim() || !user) return;
    await addDoc(collection(db, 'chat'), { text, userId: user.uid, userName: user.displayName, userPhoto: user.photoURL, createdAt: serverTimestamp() });
    setText('');
  };
  return <View style={{ flex: 1, padding: 12, backgroundColor: '#000' }}><FlatList data={messages} inverted keyExtractor={(_, i) => `${i}`} renderItem={({ item }) => <Text style={{ color: '#fff', marginBottom: 8 }}>{item.userName}: {item.text}</Text>} /><TextInput value={text} onChangeText={setText} placeholder="message" style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10 }} /><Button title="Send" onPress={send} /></View>;
}
