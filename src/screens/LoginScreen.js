import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fox Store</Text>
      <TouchableOpacity style={styles.btn} onPress={signIn}>
        <Text style={styles.btnTxt}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  title: { color: '#ffa726', fontSize: 30, fontWeight: '900', marginBottom: 24 },
  btn: { backgroundColor: '#ffa726', padding: 14, borderRadius: 12 },
  btnTxt: { color: '#000', fontWeight: '700' }
});
