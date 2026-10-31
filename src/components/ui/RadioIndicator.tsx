import { CircleCheck } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { iconColors, iconSizes } from '@/theme';

import { Icon } from './Icon';

type RadioIndicatorProps = {
  selected: boolean;
};

/** Visual radio mark. The row that contains it carries the radio role and state. */
export function RadioIndicator({ selected }: RadioIndicatorProps) {
  return selected ? (
    <Icon icon={CircleCheck} size="md" color="brand" />
  ) : (
    <View style={styles.empty} />
  );
}

const styles = StyleSheet.create({
  empty: {
    width: iconSizes.md,
    height: iconSizes.md,
    borderRadius: iconSizes.md / 2,
    borderWidth: 2,
    borderColor: iconColors.secondary,
  },
});
