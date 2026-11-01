// Dev-only catalogue of the UI kit. Labels are plain English on purpose: this screen
// never ships (the route redirects outside __DEV__), so it stays out of the locale files.
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useAtomValue, useSetAtom } from 'jotai';
import { Bell, Heart, Lock, Play, Plus, Search, Star } from 'lucide-react-native';
import { type ReactNode, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import Animated from 'react-native-reanimated';

import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  CoinAmount,
  EmptyState,
  ErrorState,
  GradientText,
  Header,
  HeaderBackButton,
  getPosterCardHeight,
  Icon,
  IconButton,
  LoadingState,
  MetaRow,
  PosterCard,
  RadioIndicator,
  Rail,
  Screen,
  SectionHeader,
  Tag,
  Text,
  useHeaderHeight,
  useHeaderScroll,
  useListBottomPadding,
} from '@/components/ui';
import { devSettings, RepositoryError, useCurrentUser, useHomeFeed } from '@/data';
import type { Series } from '@/domain';
import { coinBalanceAtom, creditCoinsAtom, resetDemoAtom } from '@/state';
import { backgroundColors, borderColors, layout, spacing, type TypographyVariant } from '@/theme';

const TYPE_VARIANTS: readonly TypographyVariant[] = [
  'display',
  'h1',
  'h2',
  'h3',
  'body',
  'bodyStrong',
  'bodySmall',
  'caption',
  'label',
  'badge',
  'buttonLarge',
];
const GENRES = ['All', 'Romance', 'Drama', 'Action'] as const;
const OPTIONS = ['Unlock Episode', 'Unlock Full Season', 'Premium Membership'] as const;
const PACKS = [
  { id: 'coins-300', coins: 300 },
  { id: 'coins-800', coins: 800 },
] as const;
const NOT_FOUND = new RepositoryError('notFound', 'demo');
const NETWORK = new RepositoryError('network', 'demo');
const DEMO_HERO_HEIGHT = 160;
const noop = () => {};

function renderPoster({ item }: { item: Series }) {
  return <PosterCard series={item} onPress={noop} />;
}

function seriesKey(series: Series) {
  return series.id;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} />
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export function KitchenSinkScreen() {
  const [genre, setGenre] = useState<string>(GENRES[0]);
  const [option, setOption] = useState<string>(OPTIONS[1]);
  const [selectedPack, setSelectedPack] = useState<string>(PACKS[1].id);
  const [simulateErrors, setSimulateErrors] = useState(devSettings.simulateNetworkErrors);
  const queryClient = useQueryClient();
  const homeFeed = useHomeFeed();
  const user = useCurrentUser();
  const balance = useAtomValue(coinBalanceAtom);
  const creditCoins = useSetAtom(creditCoinsAtom);
  const resetDemo = useSetAtom(resetDemoAtom);
  const { scrollY, onScroll } = useHeaderScroll();
  const headerHeight = useHeaderHeight();
  const bottomPadding = useListBottomPadding({ hasTabBar: false });
  const demoImage = homeFeed.data?.series[0]?.heroImage;

  function toggleErrors(value: boolean) {
    devSettings.setSimulateNetworkErrors(value);
    setSimulateErrors(value);
    void queryClient.resetQueries();
  }

  return (
    <Screen>
      <Header variant="secondary" left={<HeaderBackButton />} title="UI kit" scrollY={scrollY} />
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
      >
        {/* Runs under the floating header, which turns solid as this scrolls away. */}
        <View style={[styles.demoHero, { height: headerHeight + DEMO_HERO_HEIGHT }]}>
          {demoImage !== undefined && (
            <Image source={demoImage} style={StyleSheet.absoluteFill} contentFit="cover" />
          )}
        </View>

        <Section title="Dev tools">
          <View style={styles.rowBetween}>
            <Text>Simulate network errors</Text>
            <Switch
              value={simulateErrors}
              onValueChange={toggleErrors}
              trackColor={{ true: backgroundColors.brand, false: backgroundColors.surfaceRaised }}
              accessibilityLabel="Simulate network errors"
            />
          </View>
          <View style={styles.rowBetween}>
            <CoinAmount amount={balance} />
            <View style={styles.row}>
              <Button label="+300" size="md" variant="secondary" onPress={() => creditCoins(300)} />
              <Button label="Reset demo" size="md" variant="secondary" onPress={resetDemo} />
            </View>
          </View>
        </Section>

        <Section title="Typography">
          {TYPE_VARIANTS.map((variant) => (
            <Text key={variant} variant={variant}>
              {variant} · Verbotene Liebe
            </Text>
          ))}
          <GradientText variant="h1" accessibilityRole="header">
            Romance
          </GradientText>
        </Section>

        <Section title="Buttons">
          <Button label="Watch now" icon={Play} haptic onPress={noop} fullWidth />
          <Button label="Unlock Now" icon={Lock} shape="rounded" onPress={noop} fullWidth />
          <View style={styles.row}>
            <Button label="Loading" loading onPress={noop} size="md" />
          </View>
          <Button
            label="Buy 800 Coins"
            sublabel="for €6.99"
            variant="premium"
            shape="rounded"
            fullWidth
            onPress={noop}
          />
          <Button label="Maybe later" variant="ghost" onPress={noop} />
        </Section>

        <Section title="Icon buttons">
          <View style={styles.row}>
            <IconButton icon={Plus} accessibilityLabel="Add to list" onPress={noop} />
            <IconButton icon={Search} accessibilityLabel="Search" onPress={noop} />
            <IconButton icon={Bell} accessibilityLabel="Notifications" onPress={noop} />
            <IconButton
              icon={Heart}
              variant="filled"
              size="lg"
              accessibilityLabel="Like"
              onPress={noop}
            />
            <IconButton
              icon={Heart}
              color="accent"
              selected
              accessibilityLabel="Saved"
              onPress={noop}
            />
          </View>
        </Section>

        <Section title="Chips, tags, badges">
          <View style={styles.row}>
            {GENRES.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={genre === item}
                onPress={() => setGenre(item)}
              />
            ))}
          </View>
          <View style={styles.row}>
            <Tag label="Billionaire" variant="outline" />
            <Tag label="Ep 5" />
            <Tag label="45" />
          </View>
          <View style={styles.row}>
            <Badge variant="pro" />
            <Badge variant="spotlight" />
          </View>
          <MetaRow
            items={[
              {
                key: 'rating',
                content: (
                  <View style={styles.row}>
                    <Icon icon={Star} size="sm" color="secondary" />
                    <Text variant="bodySmall" color="secondary">
                      4.8
                    </Text>
                  </View>
                ),
              },
              { key: 'episodes', content: '72 Episodes' },
            ]}
          />
          <CoinAmount amount={15} />
        </Section>

        <Section title="Cards">
          {OPTIONS.map((item) => (
            <Card
              key={item}
              selected={option === item}
              onPress={() => setOption(item)}
              accessibilityRole="radio"
              accessibilityLabel={item}
            >
              <View style={styles.row}>
                <RadioIndicator selected={option === item} />
                <Text variant="bodyStrong">{item}</Text>
              </View>
            </Card>
          ))}
          <View style={styles.row}>
            {PACKS.map((pack) => {
              const selected = pack.id === selectedPack;
              return (
                <Card
                  key={pack.id}
                  selected={selected}
                  selectedTone="brand"
                  onPress={() => setSelectedPack(pack.id)}
                  accessibilityRole="radio"
                  accessibilityLabel={`${pack.coins} coins`}
                  style={styles.flex}
                >
                  <View style={styles.pack}>
                    <Text variant="h2">{pack.coins}</Text>
                  </View>
                </Card>
              );
            })}
          </View>
        </Section>

        <Section title="Avatars">
          <View style={styles.row}>
            {user.data && (
              <Avatar name={user.data.displayName} image={user.data.avatar} size="lg" />
            )}
            <Avatar name="Alexander Sterling" size="lg" />
            <Avatar name="Elena Hart" size="md" />
            <Avatar name="Sarah" size="sm" />
          </View>
        </Section>

        <View style={styles.section}>
          <SectionHeader
            title="Trending Romance"
            variant="h3"
            actionLabel="See all"
            onAction={noop}
          />
          <View style={{ height: getPosterCardHeight('md') }}>
            {homeFeed.isPending && <LoadingState />}
            {homeFeed.isError && (
              <ErrorState error={homeFeed.error} onRetry={() => void homeFeed.refetch()} />
            )}
            {homeFeed.data && (
              <Rail
                data={homeFeed.data.series}
                renderItem={renderPoster}
                keyExtractor={seriesKey}
                height={getPosterCardHeight('md')}
              />
            )}
          </View>
        </View>

        <Section title="States">
          <View style={styles.stateBox}>
            <LoadingState />
          </View>
          <View style={styles.stateBox}>
            <ErrorState error={NETWORK} onRetry={noop} />
          </View>
          <View style={styles.stateBox}>
            <ErrorState error={NOT_FOUND} onRetry={noop} />
          </View>
          <View style={styles.stateBox}>
            <EmptyState />
          </View>
        </Section>
      </Animated.ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
  },
  demoHero: {
    backgroundColor: backgroundColors.surface,
  },
  section: {
    gap: spacing.sm,
  },
  sectionBody: {
    gap: spacing.sm,
    paddingHorizontal: layout.screenGutter,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  pack: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  stateBox: {
    height: 200,
    borderRadius: spacing.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
  },
});
