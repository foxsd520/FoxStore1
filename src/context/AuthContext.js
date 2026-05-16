import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, serverTimestamp } from '../services/firebase';

WebBrowser.maybeCompleteAuthSession();
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [needsRoleChoice, setNeedsRoleChoice] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID });

  useEffect(() => onAuthStateChanged(auth, async (u) => {
    setUser(u);
    if (!u) return setProfile(null);
    const ref = doc(db, 'users', u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const country = await fetch('http://ip-api.com/json').then((r) => r.json()).then((d) => d.country || 'Unknown').catch(() => 'Unknown');
      await setDoc(ref, { displayName: u.displayName, email: u.email, photoURL: u.photoURL, role: null, country, createdAt: serverTimestamp() }, { merge: true });
      setNeedsRoleChoice(true);
      setProfile({ role: null, country });
    } else {
      const p = snap.data();
      setProfile(p);
      setNeedsRoleChoice(!p.role);
    }
  }), []);

  useEffect(() => {
    if (response?.type === 'success') {
      const credential = GoogleAuthProvider.credential(response.params.id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  const setRole = async (role) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), { role }, { merge: true });
    setProfile((p) => ({ ...(p || {}), role }));
    setNeedsRoleChoice(false);
  };

  const value = useMemo(() => ({ user, profile, needsRoleChoice, request, signIn: () => promptAsync(), logout: () => signOut(auth), setRole }), [user, profile, needsRoleChoice, request]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
