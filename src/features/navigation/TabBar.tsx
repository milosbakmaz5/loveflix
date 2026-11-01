import { type Tabs } from 'expo-router';
import { Bookmark, Compass, Heart, House, type LucideIcon, User } from 'lucide-react-native';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Icon, PressableScale, Text } from '@/components/ui';
import { backgroundColors, borderColors, layout, spacing } from '@/theme';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

type TabName = 'index' | 'discover' | 'romance' | 'library' | 'profile';

const TABS: Record<
  TabName,
  { icon: LucideIcon; labelKey: 'tabs.home' | `tabs.${Exclude<TabName, 'index'>}` }
> = {
  index: { icon: House, labelKey: 'tabs.home' },
  discover: { icon: Compass, labelKey: 'tabs.discover' },
  romance: { icon: Heart, labelKey: 'tabs.romance' },
  library: { icon: Bookmark, labelKey: 'tabs.library' },
  profile: { icon: User, labelKey: 'tabs.profile' },
};

function isTabName(name: string): name is TabName {
  return name in TABS;
}

/**
 * Opaque and in the layout flow, so tab screens end above it and content can never sit behind it.
 * It pads the home indicator itself.
 */
export function TabBar({ state, emitter, navigateToTab, insets }: TabBarProps) {
  const { t } = useTranslation();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        if (!isTabName(route.name)) {
          return null;
        }
        const { icon, labelKey } = TABS[route.name];
        const isActive = state.index === index;
        const label = t(labelKey);

        function handlePress() {
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isActive && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        }

        return (
          <PressableScale
            key={route.key}
            onPress={handlePress}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: isActive }}
            style={styles.tab}
          >
            <Icon icon={icon} size="lg" color={isActive ? 'brand' : 'secondary'} />
            <Text variant="caption" color={isActive ? 'brand' : 'secondary'}>
              {label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: backgroundColors.screen,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: borderColors.default,
  },
  tab: {
    flex: 1,
    height: layout.tabBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
  },
});
