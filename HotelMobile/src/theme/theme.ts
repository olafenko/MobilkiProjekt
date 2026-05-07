import { MD3DarkTheme } from 'react-native-paper';

export const COLORS = {
    background: '#121212',
    surface: '#1e1e26',
    primary: '#C5A059',
    secondary: '#2c2c34',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    error: '#CF6679',
    success: '#4CAF50',
    outline: '#3d3d45',
};

export const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: COLORS.primary,
        onPrimary: '#000000',
        background: COLORS.background,
        surface: COLORS.surface,
        onSurface: COLORS.text,
        surfaceVariant: COLORS.secondary,
        onSurfaceVariant: COLORS.textSecondary,
        error: COLORS.error,
        outline: COLORS.outline,
    },
    roundness: 3,
};