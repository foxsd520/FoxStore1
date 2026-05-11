import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { addDoc, collection, doc, getDoc, query, serverTimestamp as firestoreServerTimestamp, where, getDocs } from 'firebase/firestore';
import { getDownloadURL, getMetadata, listAll, ref, uploadBytes } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import { db, storage, serverTimestamp } from '../services/firebase';

const FREE_QUOTA_BYTES = 100 * 1024 * 1024;
const categories = [
  { key: 'games', label: 'ألعاب' },
  { key: 'productivity', label: 'إنتاجية' },
  { key: 'education', label: 'تعليم' }
];

async function folderSize(folderRef) { const listing = await listAll(folderRef); let total = 0; for (const item of listing.items) { const md = await getMetadata(item); total += Number(md.size || 0); } for (const sub of listing.prefixes) total += await folderSize(sub); return total; }

export default function UploadScreen() {
  const { user, profile } = useAuth();
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('games');
  const [image, setImage] = useState(null);
  const [binary, setBinary] = useState(null);
  const [config, setConfig] = useState({ mode: 'free', perUploadPrice: 1, monthlyPrice: 10, methods: { paypal: true } });

  useEffect(() => { getDoc(doc(db, 'store_settings', 'upload_config')).then((s) => s.exists() && setConfig((c) => ({ ...c, ...s.data() }))); }, []);

  const pickImage = async () => setImage(await ImagePicker.launchImageLibraryAsync({ quality: 0.6 }));
  const pickBin = async () => setBinary(await DocumentPicker.getDocumentAsync({ type: ['application/vnd.android.package-archive', 'application/octet-stream'] }));

  const createPayment = async (amount, type) => addDoc(collection(db, 'payments'), { developerId: user.uid, amount, status: 'paid', type, createdAt: firestoreServerTimestamp() });

  const hasActiveSubscription = async () => {
    const q = query(collection(db, 'payments'), where('developerId', '==', user.uid), where('type', '==', 'monthly_subscription'), where('status', '==', 'paid'));
    const snap = await getDocs(q);
    return !snap.empty;
  };

  const ensurePayment = async () => {
    if (config.mode === 'free') return true;
    if (config.mode === 'paid_per_upload') {
      await createPayment(config.perUploadPrice || 1, 'paid_per_upload');
      Alert.alert(`تم الدفع بنجاح: $${config.perUploadPrice || 1}`);
      return true;
    }
    if (config.mode === 'monthly_subscription') {
      const active = await hasActiveSubscription();
      if (active) return true;
      await createPayment(config.monthlyPrice || 10, 'monthly_subscription');
      Alert.alert(`تم تفعيل الاشتراك الشهري: $${config.monthlyPrice || 10}`);
      return true;
    }
    return true;
  };

  const upload = async () => {
    if (!user || !image?.assets?.[0] || !binary?.assets?.[0]) return Alert.alert('Missing data');
    const isAdmin = user.email === 'foxsd520@gmail.com' || profile?.role === 'admin';
    const canUpload = isAdmin || profile?.role === 'developer';
    if (!canUpload) return Alert.alert('غير مسموح بالرفع، اطلب حساب مطور أولاً');

    const allowed = await ensurePayment();
    if (!allowed) return;

    const imgBlob = await (await fetch(image.assets[0].uri)).blob();
    const fileBlob = await (await fetch(binary.assets[0].uri)).blob();
    const userRoot = ref(storage, `apps/${user.uid}`);
    const usedBytes = await folderSize(userRoot);
    const nextBytes = usedBytes + imgBlob.size + fileBlob.size;
    if (nextBytes > FREE_QUOTA_BYTES) return Alert.alert('وصلت الحد المجاني، تواصل مع الإدارة');

    const ts = Date.now();
    const iconRef = ref(storage, `apps/${user.uid}/${ts}.jpg`);
    const fileRef = ref(storage, `apps/${user.uid}/${ts}-${binary.assets[0].name}`);
    await uploadBytes(iconRef, imgBlob); await uploadBytes(fileRef, fileBlob);
    const iconUrl = await getDownloadURL(iconRef); const fileUrl = await getDownloadURL(fileRef);

    await addDoc(collection(db, 'apps'), { name, shortDescription, description, category, iconUrl, fileUrl, fileName: binary.assets[0].name, ownerId: user.uid, ownerName: user.displayName, ownerEmail: user.email, status: 'pending', downloadsCount: 0, createdAt: serverTimestamp(), uploadBytes: imgBlob.size + fileBlob.size, usedQuotaBytesBeforeUpload: usedBytes });
    Alert.alert('Uploaded for review (Pending admin approval)');
  };

  return <View style={{ flex: 1, padding: 12, gap: 8, backgroundColor: '#111' }}><Text style={{ color: '#fff' }}>وضع الرفع الحالي: {config.mode}</Text><TextInput placeholder="Name" value={name} onChangeText={setName} style={{ backgroundColor: '#fff', padding: 10 }} /><TextInput placeholder="Short description" value={shortDescription} onChangeText={setShortDescription} style={{ backgroundColor: '#fff', padding: 10 }} /><TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ backgroundColor: '#fff', padding: 10 }} multiline /><Text style={{ color: '#fff', marginTop: 4 }}>التصنيف</Text><View style={{ flexDirection: 'row', gap: 8 }}>{categories.map((c) => <TouchableOpacity key={c.key} onPress={() => setCategory(c.key)} style={{ backgroundColor: category === c.key ? '#ffa726' : '#333', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 }}><Text style={{ color: category === c.key ? '#000' : '#fff' }}>{c.label}</Text></TouchableOpacity>)}</View><Button title="Pick App Image" onPress={pickImage} /><Button title="Pick APK/AAB" onPress={pickBin} /><Button title="Upload" onPress={upload} /></View>;
}
