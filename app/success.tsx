import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
} from 'react-native-reanimated';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { Card } from '../components/ui/Card';
import { GradientBackground } from '../components/ui/GradientBackground';
import { CONFIG } from '../constants/config';
import { useGame } from './context/GameContext';

const { width } = Dimensions.get('window');

export default function SuccessScreen() {
  const { 
    currentQuestion, 
    score, 
    level, 
    setSelectedAnswer, 
    setCurrentQuestion,
    lastResponse 
  } = useGame();
  const [isNavigating, setIsNavigating] = useState(false);

  // Animation values
  const trophyScale = useSharedValue(0);
  const confettiOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.8);

  React.useEffect(() => {
    // Animate trophy
    trophyScale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 100 }),
      withSpring(1, { damping: 15, stiffness: 150 })
    );

    // Animate card
    cardScale.value = withSpring(1, { damping: 15, stiffness: 150 });

    // Animate confetti
    confettiOpacity.value = withDelay(
      300,
      withSpring(1, { damping: 15, stiffness: 150 })
    );
  }, []);

  const trophyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  const confettiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleNextLocation = async () => {
    if (isNavigating) return;
    
    setIsNavigating(true);

    try {
      // Get coordinates from API response
      const coordinates = lastResponse?.coordinates;
      
      if (!coordinates) {
        Alert.alert('No Location', 'No next location coordinates provided.');
        setIsNavigating(false);
        return;
      }

      console.log('Opening coordinates:', coordinates);
      console.log('Location name:', lastResponse?.locationName);
      
      // Create Google Maps URL with coordinates
      const url = `https://www.google.com/maps/search/?api=1&query=${coordinates}`;
      
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        
        // Show next clue if available
        if (lastResponse?.nextClue) {
          setTimeout(() => {
            Alert.alert(
              'Next Clue!',
              lastResponse.nextClue,
              [
                {
                  text: 'Got it!',
                  onPress: () => {
                    setSelectedAnswer('');
                    setCurrentQuestion(null);
                    router.push('/');
                  },
                },
              ]
            );
          }, 1000);
        } else {
          // Navigate back to home after a delay
          setTimeout(() => {
            setSelectedAnswer('');
            setCurrentQuestion(null);
            router.push('/');
          }, 1500);
        }
      } else {
        Alert.alert('Error', 'Cannot open Google Maps');
      }
      
    } catch (error) {
      console.error('Error opening maps:', error);
      Alert.alert('Error', 'Failed to open location in maps');
    } finally {
      setIsNavigating(false);
    }
  };

  const handlePlayAgain = () => {
    setSelectedAnswer('');
    setCurrentQuestion(null);
    router.push('/');
  };

  // Get points from API response or fallback to question data
  const pointsEarned = lastResponse?.pointsAwarded || currentQuestion?.pointsRewarded[0] || 0;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Confetti Background */}
        <Animated.View style={[styles.confettiContainer, confettiAnimatedStyle]}>
          {[...Array(20)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.confetti,
                {
                  left: Math.random() * width,
                  top: Math.random() * 200,
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][
                    Math.floor(Math.random() * 5)
                  ],
                },
              ]}
            />
          ))}
        </Animated.View>

        <View style={styles.content}>
          <Animated.View style={[styles.successCard, cardAnimatedStyle]}>
            <Card style={styles.card}>
              {/* Trophy Animation */}
              <Animated.View style={[styles.trophyContainer, trophyAnimatedStyle]}>
                <Ionicons name="trophy" size={80} color={CONFIG.COLORS.accent} />
              </Animated.View>

              {/* Success Message */}
              <Text style={styles.successTitle}>Fantastic!</Text>
              <Text style={styles.successSubtitle}>You got it right!</Text>

              {/* Points Earned */}
              <View style={styles.pointsContainer}>
                <Ionicons name="star" size={24} color={CONFIG.COLORS.accent} />
                <Text style={styles.pointsText}>
                  +{pointsEarned} Points
                </Text>
              </View>

              {/* Next Location Info */}
              {lastResponse?.locationName && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={20} color={CONFIG.COLORS.primary} />
                  <Text style={styles.locationText}>
                    Next: {lastResponse.locationName}
                  </Text>
                </View>
              )}

              {/* Next Clue Preview */}
              {lastResponse?.nextClue && (
                <View style={styles.clueContainer}>
                  <Ionicons name="eye" size={16} color={CONFIG.COLORS.gray} />
                  <Text style={styles.clueText}>
                    "{lastResponse.nextClue}"
                  </Text>
                </View>
              )}

              {/* Current Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{score}</Text>
                  <Text style={styles.statLabel}>Total Score</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{level}</Text>
                  <Text style={styles.statLabel}>Level</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                {lastResponse?.coordinates ? (
                  <AnimatedButton
                    title={isNavigating ? 'Opening Maps...' : 'Go to Next Location'}
                    icon="map"
                    onPress={handleNextLocation}
                    variant="primary"
                    disabled={isNavigating}
                    style={styles.primaryButton}
                  />
                ) : (
                  <AnimatedButton
                    title="Continue Playing"
                    icon="play"
                    onPress={handlePlayAgain}
                    variant="primary"
                    style={styles.primaryButton}
                  />
                )}
                
                <AnimatedButton
                  title="Play Again"
                  icon="refresh"
                  onPress={handlePlayAgain}
                  variant="secondary"
                  style={styles.secondaryButton}
                />
              </View>
            </Card>
          </Animated.View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 1,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    zIndex: 2,
  },
  successCard: {
    alignItems: 'center',
  },
  card: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: '100%',
  },
  trophyContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    gap: 8,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57F17',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: CONFIG.COLORS.primary,
  },
  clueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
    marginBottom: 25,
    gap: 8,
  },
  clueText: {
    flex: 1,
    fontSize: 13,
    color: CONFIG.COLORS.gray,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: CONFIG.COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#DDD',
    marginHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});