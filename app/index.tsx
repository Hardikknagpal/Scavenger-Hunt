import { useGame } from '@/app/context/GameContext';
import { GameStats } from '@/components/GameStats';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Card } from '@/components/ui/Card';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { score, level } = useGame();

  const handleStartScanning = () => {
    router.push('/scanner');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="trophy" size={32} color="#FFD700" />
            <Text style={styles.title}>Hunt Quest</Text>
            <Ionicons name="trophy" size={32} color="#FFD700" />
          </View>
          <GameStats />
        </View>

        <View style={styles.content}>
          <Card style={styles.mainCard}>
            <Ionicons name="scan" size={64} color="#667eea" style={styles.mainIcon} />
            <Text style={styles.mainTitle}>Ready for Adventure?</Text>
            <Text style={styles.mainSubtitle}>
              Scan QR codes to discover clues and solve puzzles in this exciting scavenger hunt!
            </Text>
            
            <AnimatedButton
              title="Start Scanning"
              icon="camera"
              onPress={handleStartScanning}
              style={styles.scanButton}
            />
          </Card>

          <View style={styles.statsGrid}>
            <Card variant="glass" style={styles.statCard}>
              <Text style={styles.statNumber}>{score}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </Card>
            <Card variant="glass" style={styles.statCard}>
              <Text style={styles.statNumber}>{level - 1}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </Card>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginHorizontal: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  mainCard: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 40,
  },
  mainIcon: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  scanButton: {
    width: width * 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
});