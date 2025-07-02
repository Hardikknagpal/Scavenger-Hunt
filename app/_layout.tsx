import { GameProvider } from '@/app/context/GameContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="scanner" />
        <Stack.Screen name="question" />
        <Stack.Screen name="success" />
      </Stack>
      <StatusBar style="light" />
    </GameProvider>
  );
}