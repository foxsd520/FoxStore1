import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Switch, Text, TextInput, View } from 'react-native';
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../services/firebase';

const SETTINGS_DOC = 'upload_config';

export default function AdminScreen() {
  const [apps, setApps] = useState([]); const [chat, setChat] = useState([]); const [requests, setRequests] = useState([]);
  const [mode, setMode] = useState('free'); const [perUploadPrice, setPerUploadPrice] = useState('1'); const [monthlyPrice, setMonthlyPrice] = useState('10'); const [devPaidAmount, setDevPaidAmount] = useState('5');
  const [methods, setMethods] = useState({ paypal: true, stripe: false, bank: false, telecom: false });

  useEffect(() => onSnapshot(collection(db, 'apps'), (s) => setApps(s.docs.map((d) => ({ id: d.id, ...d.data() })))), []);
  useEffect(() => onSnapshot(collection(db, 'chat'), (s) => setChat(s.docs.map((d) => ({ id: d.id, ...d.data() })))), []);
  useEffect(() => onSnapshot(collection(db, 'developer_requests'), (s) => setRequests(s.docs.map((d) => ({ id: d.id, ...d.data() })))), []);
  useEffect(() => onSnapshot(doc(db, 'store_settings', SETTINGS_DOC), (snap) => { if (!snap.exists()) return; const data = snap.data(); setMode(data.mode || 'free'); setPerUploadPrice(String(data.perUploadPrice ?? 1)); setMonthlyPrice(String(data.monthlyPrice ?? 10)); setMethods(data.methods || methods); }), []);

  const saveSettings = async () => { await setDoc(doc(db, 'store_settings', SETTINGS_DOC), { mode, perUploadPrice: Number(perUploadPrice || 1), monthlyPrice: Number(monthlyPrice || 10), methods, updatedAt: new Date().toISOString() }, { merge: true }); Alert.alert('Saved'); };
  const toggleMethod = (key) => setMethods((m) => ({ ...m, [key]: !m[key] }));

  const approveFree = async (r) => { await updateDoc(doc(db, 'developer_requests', r.id), { status: 'approved_free' }); await setDoc(doc(db, 'users', r.userId), { role: 'developer' }, { merge: true }); };
  const approvePaid = async (r) => { await updateDoc(doc(db, 'developer_requests', r.id), { status: 'pending_payment', paymentAmount: Number(devPaidAmount || 5) }); };
  const rejectReq = async (r) => updateDoc(doc(db, 'developer_requests', r.id), { status: 'rejected' });

  const deleteApp = async (app) => {
    Alert.alert('تأكيد', 'هل انت متأكد؟', [
      { text: 'لا' },
      { text: 'نعم', onPress: async () => {
        if (app.iconUrl?.includes('/o/')) {
          const iconPath = decodeURIComponent(app.iconUrl.split('/o/')[1].split('?')[0]);
          await deleteObject(ref(storage, iconPath)).catch(() => {});
        }
        if (app.fileUrl?.includes('/o/')) {
          const filePath = decodeURIComponent(app.fileUrl.split('/o/')[1].split('?')[0]);
          await deleteObject(ref(storage, filePath)).catch(() => {});
        }
        await deleteDoc(doc(db, 'apps', app.id));
      } }
    ]);
  };

  return <View style={{ flex: 1, backgroundColor: '#000', padding: 12 }}>
    <Text style={{ color: '#FF6B35', fontWeight: '700', marginBottom: 6 }}>إعدادات الرفع</Text>
    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}><Button title={mode === 'free' ? '◉ مجاني' : '○ مجاني'} color="#FF6B35" onPress={() => setMode('free')} /><Button title={mode === 'paid_per_upload' ? '◉ مدفوع لكل رفع' : '○ مدفوع لكل رفع'} color="#FF6B35" onPress={() => setMode('paid_per_upload')} /><Button title={mode === 'monthly_subscription' ? '◉ اشتراك شهري' : '○ اشتراك شهري'} color="#FF6B35" onPress={() => setMode('monthly_subscription')} /></View>
    {mode === 'paid_per_upload' ? <TextInput value={perUploadPrice} onChangeText={setPerUploadPrice} placeholder="1" style={{ backgroundColor: '#fff', marginBottom: 8, padding: 8 }} /> : null}
    {mode === 'monthly_subscription' ? <TextInput value={monthlyPrice} onChangeText={setMonthlyPrice} placeholder="10" style={{ backgroundColor: '#fff', marginBottom: 8, padding: 8 }} /> : null}
    <Text style={{ color: '#fff' }}>طرق الدفع:</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}><Switch value={methods.paypal} onValueChange={() => toggleMethod('paypal')} /><Text style={{ color: '#fff' }}>PayPal</Text></View><View style={{ flexDirection: 'row', alignItems: 'center' }}><Switch value={methods.stripe} onValueChange={() => toggleMethod('stripe')} /><Text style={{ color: '#fff' }}>Stripe</Text></View><View style={{ flexDirection: 'row', alignItems: 'center' }}><Switch value={methods.bank} onValueChange={() => toggleMethod('bank')} /><Text style={{ color: '#fff' }}>تحويل بنكي</Text></View><View style={{ flexDirection: 'row', alignItems: 'center' }}><Switch value={methods.telecom} onValueChange={() => toggleMethod('telecom')} /><Text style={{ color: '#fff' }}>رصيد MTN/Zain</Text></View>
    <Button title="حفظ إعدادات الرفع" color="#FF6B35" onPress={saveSettings} />

    <Text style={{ color: '#FF6B35', fontWeight: '700', marginTop: 12 }}>طلبات المطورين</Text>
    <TextInput value={devPaidAmount} onChangeText={setDevPaidAmount} placeholder="سعر القبول المدفوع" style={{ backgroundColor: '#fff', marginBottom: 8, padding: 8 }} />
    <FlatList data={requests} keyExtractor={(i) => i.id} renderItem={({ item }) => <View style={{ borderBottomWidth: 1, borderBottomColor: '#333', paddingVertical: 8 }}><Text style={{ color: '#fff' }}>{item.name} | {item.email}</Text><Text style={{ color: '#ddd' }}>الدولة: {item.country} | الحالة: {item.status}</Text><Text style={{ color: '#ddd' }}>الرسالة: {item.message}</Text><Button title="قبول مجاناً" onPress={() => approveFree(item)} /><Button title="قبول مدفوع" onPress={() => approvePaid(item)} /><Button title="رفض" onPress={() => rejectReq(item)} /></View>} />

    <Text style={{ color: '#FF6B35', fontWeight: '700', marginTop: 12 }}>إدارة التطبيقات</Text>
    <FlatList data={apps} keyExtractor={(i) => i.id} renderItem={({ item }) => <View><Text style={{ color: '#fff' }}>{item.name} ({item.status})</Text><Button title="Approve" onPress={() => updateDoc(doc(db, 'apps', item.id), { status: 'approved' })} /><Button title="Reject" onPress={() => updateDoc(doc(db, 'apps', item.id), { status: 'rejected' })} /><Button title="حذف" onPress={() => deleteApp(item)} /></View>} />
    <Text style={{ color: '#FF6B35', fontWeight: '700' }}>Chat Moderation</Text>
    <FlatList data={chat} keyExtractor={(i) => i.id} renderItem={({ item }) => <View><Text style={{ color: '#fff' }}>{item.text}</Text><Button title="Delete" onPress={() => deleteDoc(doc(db, 'chat', item.id))} /></View>} />
  </View>;
}
