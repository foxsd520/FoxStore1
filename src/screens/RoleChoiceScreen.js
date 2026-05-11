import React from 'react';
import { Button, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function RoleChoiceScreen() {
  const { setRole } = useAuth();
  const nav = useNavigation();
  return <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#121212' }}><Text style={{ color: '#fff', fontSize: 20, marginBottom: 20 }}>كيف عايز تستخدم Fox Store؟</Text><Button color="#FF6B35" title="مستخدم عادي" onPress={() => setRole('user')} /><View style={{ height: 10 }} /><Button color="#FF6B35" title="طلب حساب مطور" onPress={() => nav.navigate('DeveloperRequest')} /></View>;
}
