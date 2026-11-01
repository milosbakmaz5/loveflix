import { router } from 'expo-router';
import { Bell, Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Avatar, Icon, PressableScale } from '@/components/ui';
import { useCurrentUser } from '@/data';
import { backgroundColors, spacing } from '@/theme';

const DOT_SIZE = 8;

/** Search and the bell have no destination yet, so they are plain icons, not buttons. */
export function HomeHeaderActions() {
  const { t } = useTranslation();
  const user = useCurrentUser();

  return (
    <View style={styles.row}>
      <Icon icon={Search} />
      <View>
        <Icon icon={Bell} />
        <View style={styles.dot} />
      </View>
      {user.data && (
        <PressableScale
          onPress={() => router.navigate('/profile')}
          accessibilityRole="button"
          accessibilityLabel={t('home.profile')}
          hitSlop={spacing.xs}
        >
          <Avatar name={user.data.displayName} image={user.data.avatar} size="sm" />
        </PressableScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: backgroundColors.brand,
  },
});
