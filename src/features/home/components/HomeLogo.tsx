import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui';
import { backgroundColors, radii } from '@/theme';

const LOGO_SIZE = 32;

export function HomeLogo() {
  const { t } = useTranslation();
  const mark = (
    <View
      style={styles.logo}
      accessible
      accessibilityRole="image"
      accessibilityLabel={t('app.name')}
    >
      <Icon icon={Heart} color="onBrand" />
    </View>
  );

  // Dev builds only: long press opens the UI kit catalogue.
  return __DEV__ ? (
    <Pressable onLongPress={() => router.push('/dev/kitchen-sink')}>{mark}</Pressable>
  ) : (
    mark
  );
}

const styles = StyleSheet.create({
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
    backgroundColor: backgroundColors.brand,
  },
});
