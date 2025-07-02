import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { CONFIG } from '../../constants/config';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function AnimatedButton({
  title,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, CONFIG.ANIMATIONS.springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, CONFIG.ANIMATIONS.springConfig, () => {
      runOnJS(onPress)();
    });
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button, style];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryButton];
      case 'secondary':
        return [...baseStyle, styles.secondaryButton];
      case 'success':
        return [...baseStyle, styles.successButton];
      case 'danger':
        return [...baseStyle, styles.dangerButton];
      default:
        return [...baseStyle, styles.primaryButton];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, textStyle];
    
    if (variant === 'secondary') {
      return [...baseStyle, styles.secondaryButtonText];
    }
    
    return baseStyle;
  };

  return (
    <AnimatedTouchable
      style={[animatedStyle, getButtonStyle(), disabled && styles.disabledButton]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={24}
          color={variant === 'secondary' ? CONFIG.COLORS.primary : CONFIG.COLORS.white}
          style={styles.icon}
        />
      )}
      <Text style={[getTextStyle(), disabled && styles.disabledText]}>
        {title}
      </Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    minHeight: 56,
  },
  primaryButton: {
    backgroundColor: CONFIG.COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: CONFIG.COLORS.white,
    borderWidth: 2,
    borderColor: CONFIG.COLORS.primary,
  },
  successButton: {
    backgroundColor: CONFIG.COLORS.success,
  },
  dangerButton: {
    backgroundColor: CONFIG.COLORS.error,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: CONFIG.COLORS.white,
  },
  secondaryButtonText: {
    color: CONFIG.COLORS.primary,
  },
  disabledText: {
    color: '#999',
  },
  icon: {
    marginRight: 8,
  },
});