import { CONFIG } from '@/constants/config';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: string[];
}

export function GradientBackground({ 
  children, 
  colors = [CONFIG.COLORS.primary, CONFIG.COLORS.secondary] 
}: GradientBackgroundProps) {
  return (
    <LinearGradient colors={colors} style={styles.gradient}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});