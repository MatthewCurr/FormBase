import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const LightThemeCustom = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#10B981', 
    background: '#ECFDF5',
    card: '#c7ebca',
    text: '#065F46',  
    border: '#C8E6C9',
    notification: '#3EB489',
    view: '#3B82F6',
  },
};

export const DarkThemeCustom = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#34D399',
    // background: '#0E1412',
    background: '#022C22',
    card: '#064E3B',
    text: '#A7F3D0', 
    border: '#222222',
    notification: '#3EB489',
    view: '#60A5FA',
  },
};