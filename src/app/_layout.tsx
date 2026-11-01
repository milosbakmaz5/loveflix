import '@/lib/i18n';

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createMockRepositories, devSettings, RepositoryProvider } from '@/data';
import { createQueryClient } from '@/lib/queryClient';
import { backgroundColors, borderColors, textColors } from '@/theme';

void SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: backgroundColors.screen,
    card: backgroundColors.screen,
    primary: textColors.brand,
    text: textColors.primary,
    border: borderColors.default,
  },
};

export default function RootLayout() {
  const [queryClient] = useState(createQueryClient);
  const [repositories] = useState(() =>
    createMockRepositories({ shouldFail: () => devSettings.simulateNetworkErrors }),
  );
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const isReady = fontsLoaded || fontError != null;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <RepositoryProvider repositories={repositories}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={navigationTheme}>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: backgroundColors.screen },
                }}
              >
                <Stack.Screen
                  name="unlock/[episodeId]"
                  options={{ presentation: 'formSheet', sheetAllowedDetents: 'fitToContents' }}
                />
              </Stack>
            </ThemeProvider>
          </QueryClientProvider>
        </RepositoryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: backgroundColors.screen,
  },
});
