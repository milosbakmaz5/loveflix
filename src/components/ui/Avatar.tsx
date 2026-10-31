import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import type { ImageRef } from '@/domain';
import { backgroundColors, borderColors } from '@/theme';

import { Text } from './Text';

type AvatarSize = 'sm' | 'md' | 'lg';

type AvatarProps = {
  name: string;
  image?: ImageRef;
  size?: AvatarSize;
};

const DIAMETER: Record<AvatarSize, number> = { sm: 32, md: 48, lg: 72 };

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

/** Round photo, or initials when there is none (our cast has no photos). */
export function Avatar({ name, image, size = 'md' }: AvatarProps) {
  const diameter = DIAMETER[size];
  const shape = { width: diameter, height: diameter, borderRadius: diameter / 2 };

  if (image !== undefined) {
    return (
      <Image
        source={image}
        style={[styles.base, shape]}
        contentFit="cover"
        accessibilityLabel={name}
        accessible
      />
    );
  }
  return (
    <View style={[styles.base, styles.fallback, shape]} accessible accessibilityLabel={name}>
      <Text variant={size === 'lg' ? 'h2' : 'bodyStrong'} color="secondary">
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColors.surfaceRaised,
  },
});
