import React from 'react';
import { Button, Text, View } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { useAppSettings } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const { language, isDark, toggleTheme, toggleLanguage } = useAppSettings();
  const { logout, profile } = useAuth();
  const { colors } = useTheme();
  const nav = useNavigation();

  return <View style={{ flex: 1, backgroundColor: colors.background, padding: 20, gap: 10 }}><Text style={{ color: colors.text }}>Language: {language}</Text><Button color="#FF6B35" title="Toggle Language AR/EN" onPress={toggleLanguage} /><Text style={{ color: colors.text }}>Theme: {isDark ? 'Dark' : 'Light'}</Text><Button color="#FF6B35" title="Toggle Theme" onPress={toggleTheme} />{profile?.role === 'user' ? <Button color="#FF6B35" title="أريد أن أصبح مطور" onPress={() => nav.navigate('DeveloperRequest')} /> : null}<Button color="#FF6B35" title="Logout" onPress={logout} /></View>;
}
