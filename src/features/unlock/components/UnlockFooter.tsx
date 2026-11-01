import { Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui';
import { spacing } from '@/theme';

type UnlockFooterProps = {
  onConfirm: () => void;
  onDismiss: () => void;
};

export function UnlockFooter({ onConfirm, onDismiss }: UnlockFooterProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.footer}>
      <Button
        label={t('unlock.confirm')}
        icon={Lock}
        shape="rounded"
        fullWidth
        haptic
        onPress={onConfirm}
      />
      <Button label={t('unlock.dismiss')} variant="ghost" size="md" fullWidth onPress={onDismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: spacing.xs,
  },
});
