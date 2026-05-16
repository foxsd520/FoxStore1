import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';

export default function DeveloperRequestScreen() {
  const [bio, setBio] = useState('');
  const { user, profile, setRole } = useAuth();

  const submit = async () => {
    if (!user) return;
    await addDoc(collection(db, 'developer_requests'), {
      userId: user.uid,
      name: user.displayName,
      email: user.email,
      country: profile?.country || 'Unknown',
      message: bio,
      status: 'pending',
      paymentAmount: 0,
      createdAt: serverTimestamp()
    });
    await setDoc(doc(db, 'users', user.uid), { role: 'user' }, { merge: true });
    setRole('user');
    Alert.alert('تم إرسال الطلب');
  };

  return <View style={{ flex: 1, padding: 16, backgroundColor: '#121212' }}><Text style={{ color: '#fff' }}>نبذة عن تطبيقاتك</Text><TextInput value={bio} onChangeText={setBio} multiline style={{ backgroundColor: '#fff', marginVertical: 12, minHeight: 120, padding: 8 }} /><Button color="#FF6B35" title="إرسال طلب الترقية" onPress={submit} /></View>;
}
