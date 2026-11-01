import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Avatar, Rail, SectionHeader, Text } from '@/components/ui';
import type { CastMember } from '@/domain';
import { spacing } from '@/theme';

type CastRailProps = {
  cast: readonly CastMember[];
};

const CAST_CARD_WIDTH = 120;
const CAST_RAIL_HEIGHT = 116;

function renderCastMember({ item }: { item: CastMember }) {
  return (
    <View style={styles.card}>
      <Avatar name={item.name} image={item.avatar} size="lg" />
      <Text variant="bodySmall" align="center" numberOfLines={1}>
        {item.name}
      </Text>
      <Text variant="caption" color="secondary" align="center" numberOfLines={1}>
        {item.role}
      </Text>
    </View>
  );
}

function getCastKey(member: CastMember) {
  return member.id;
}

export function CastRail({ cast }: CastRailProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <SectionHeader title={t('series.cast')} />
      <Rail
        data={cast}
        renderItem={renderCastMember}
        keyExtractor={getCastKey}
        height={CAST_RAIL_HEIGHT}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  card: {
    width: CAST_CARD_WIDTH,
    alignItems: 'center',
    gap: spacing.xxs,
  },
});
