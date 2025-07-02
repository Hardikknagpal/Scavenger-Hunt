import { useGame } from '@/app/context/GameContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CONFIG } from '../constants/config';
import { Card } from './ui/Card';

export function GameStats() {
  const { score, level } = useGame();

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Card variant="glass" style={styles.statBadge}>
          <Ionicons name="star" size={16} color={CONFIG.COLORS.white} />
          <Text style={styles.statText}>Level {level}</Text>
        </Card>
        <Card variant="glass" style={styles.statBadge}>
          <Ionicons name="flash" size={16} color={CONFIG.COLORS.white} />
          <Text style={styles.statText}>{score} pts</Text>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
    minWidth: 80,
    justifyContent: 'center',
  },
  statText: {
    color: CONFIG.COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});