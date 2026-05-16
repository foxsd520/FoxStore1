import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const brand = '#FF6B35';

export const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brand,
    background: '#FFFFFF',
    surface: '#FFFFFF',
    onBackground: '#000000',
    onSurface: '#000000'
  }
};

export const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: brand,
    background: '#121212',
    surface: '#121212',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF'
  }
};

export const navLightTheme = {
  dark: false,
  colors: {
    primary: brand,
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    border: '#E6E6E6',
    notification: brand
  }
};

export const navDarkTheme = {
  dark: true,
  colors: {
    primary: brand,
    background: '#121212',
    card: '#121212',
    text: '#FFFFFF',
    border: '#2E2E2E',
    notification: brand
  }
};
