import { Flame, Sparkles } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card, Icon, Text } from '@/components/ui';
import { layout, spacing } from '@/theme';

type WhyYoullLoveItProps = {
  highlights: readonly string[];
};

export function WhyYoullLoveIt({ highlights }: WhyYoullLoveItProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Card>
        <View style={styles.rows}>
          <View style={styles.row}>
            <Icon icon={Sparkles} size="md" color="accent" />
            <Text variant="h3" accessibilityRole="header">
              {t('series.whyYoullLoveIt')}
            </Text>
          </View>
          {highlights.map((highlight) => (
            <View key={highlight} style={styles.row}>
              <Icon icon={Flame} size="md" color="brand" />
              <Text variant="body" color="secondary" style={styles.highlight}>
                {highlight}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: layout.screenGutter,
  },
  rows: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  highlight: {
    flex: 1,
  },
});
