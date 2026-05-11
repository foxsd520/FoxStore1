import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import UploadScreen from '../screens/UploadScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AdminScreen from '../screens/AdminScreen';
import RoleChoiceScreen from '../screens/RoleChoiceScreen';
import DeveloperRequestScreen from '../screens/DeveloperRequestScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs({ user }) {
  const isAdmin = user?.email === 'foxsd520@gmail.com';
  return (
    <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: '#121212' }, headerTintColor: '#FF6B35', tabBarStyle: { backgroundColor: '#121212' }, tabBarActiveTintColor: '#FF6B35', tabBarInactiveTintColor: '#A0A0A0' }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="grid" size={20} color={color} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={20} color={color} /> }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbox" size={20} color={color} /> }} />
      <Tab.Screen name="Upload" component={UploadScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="cloud-upload" size={20} color={color} /> }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="settings" size={20} color={color} /> }} />
      {isAdmin ? <Tab.Screen name="Admin" component={AdminScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="shield-checkmark" size={20} color={color} /> }} /> : null}
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user, needsRoleChoice } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? <Stack.Screen name="Login" component={LoginScreen} /> : needsRoleChoice ? <>
        <Stack.Screen name="RoleChoice" component={RoleChoiceScreen} />
        <Stack.Screen name="DeveloperRequest" component={DeveloperRequestScreen} />
      </> : <>
        <Stack.Screen name="Main">{() => <MainTabs user={user} />}</Stack.Screen>
        <Stack.Screen name="DeveloperRequest" component={DeveloperRequestScreen} />
      </>}
    </Stack.Navigator>
  );
}
