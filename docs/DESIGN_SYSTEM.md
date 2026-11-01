# LoveFlix design system

Source: Figma `VExYIVQbnvbL3pA30c9Bdr`. The file is an SVG import (flattened vectors), so values below were sampled from rendered screenshots and rounded to a consistent scale. Implementation lives in `src/theme`; components must only use these tokens.

## Colors

Two layers. **Core tokens** (`src/theme/palette.ts`) hold raw values and are private to `src/theme`. **Semantic tokens** (`src/theme/colors.ts`) say what a color is for and point at the palette; components only use these. A component prop accepts only its own group (e.g. `Text` takes a `TextColor`).

### Core palette

| Token       | Value                    |
| ----------- | ------------------------ |
| `black`     | `#000000`                |
| `white`     | `#FFFFFF`                |
| `ink950`    | `#0B0B14`                |
| `navy900`   | `#18172B`                |
| `navy850`   | `#1A192F`                |
| `slate800`  | `#212E43`                |
| `teal900`   | `#112A2B`                |
| `cyan400`   | `#64EDF7`                |
| `violet400` | `#B87DF7`                |
| `violet500` | `#C46FF8`                |
| `white65`   | `rgba(255,255,255,0.65)` |
| `white40`   | `rgba(255,255,255,0.40)` |
| `white10`   | `rgba(255,255,255,0.10)` |
| `black0`    | `rgba(0,0,0,0)`          |
| `black60`   | `rgba(0,0,0,0.60)`       |
| `black85`   | `rgba(0,0,0,0.85)`       |

### Semantic tokens

| Group              | Token                                                    | → Core       | Usage                                                    |
| ------------------ | -------------------------------------------------------- | ------------ | -------------------------------------------------------- |
| `textColors`       | `primary`                                                | `white`      | Titles, body on dark                                     |
|                    | `secondary`                                              | `white65`    | Subtitles, meta                                          |
|                    | `muted`                                                  | `white40`    | Captions, legal, inactive tabs                           |
|                    | `brand`                                                  | `cyan400`    | Prices, "See all", active tab label                      |
|                    | `accent`                                                 | `violet400`  | Bonus text, "Unlock" links, Spotlight / PRO              |
|                    | `onBrand`                                                | `ink950`     | Text on cyan buttons/chips                               |
| `backgroundColors` | `screen`                                                 | `black`      | Screen background                                        |
|                    | `surface`                                                | `navy900`    | Cards, option rows, list groups, segmented control track |
|                    | `surfaceRaised`                                          | `navy850`    | Sheet card, sign-in card                                 |
|                    | `surfaceSelected`                                        | `slate800`   | Selected unlock option                                   |
|                    | `surfaceSelectedBrand`                                   | `teal900`    | Selected coin pack                                       |
|                    | `brand`                                                  | `cyan400`    | Primary CTAs, active chip                                |
|                    | `overlay`                                                | `black60`    | Lock overlay on posters/video                            |
| `borderColors`     | `default`                                                | `white10`    | Card / button outlines                                   |
|                    | `selected`                                               | `cyan400`    | Selected card outline                                    |
| `iconColors`       | `primary` · `secondary` · `brand` · `accent` · `onBrand` | same as text | Icons                                                    |
| `shadowColors`     | `brandGlow`                                              | `cyan400`    | Glow under primary CTAs                                  |

**Gradients**

- `premium`: `cyan400` → `violet500` (left→right). Manage button, Best Value badge, VIP/Buy button border.
- `scrim`: `black0` → `black85`. Bottom fade on hero/player.

## Typography

| Variant       | Font             | Size / line height | Weight                             | Usage                                            |
| ------------- | ---------------- | ------------------ | ---------------------------------- | ------------------------------------------------ |
| `display`     | Playfair Display | 32 / 38            | 700                                | Hero title                                       |
| `h1`          | Playfair Display | 24 / 30            | 700                                | Screen titles, sheet title                       |
| `h2`          | Playfair Display | 20 / 26            | 700                                | Section titles ("Trending Romance")              |
| `h3`          | Playfair Display | 16 / 22            | 600                                | Card & episode titles                            |
| `body`        | Inter            | 15 / 22            | 400                                | Body text, synopsis                              |
| `bodyStrong`  | Inter            | 15 / 22            | 600                                | Button labels, option titles                     |
| `buttonLarge` | Inter            | 18 / 24            | 600                                | Large sans CTA label ("Buy 800 Coins", gradient) |
| `bodySmall`   | Inter            | 13 / 18            | 400                                | Meta, subtitles                                  |
| `caption`     | Inter            | 11 / 14            | 500                                | Poster meta, tab labels                          |
| `badge`       | Inter            | 10 / 14            | 600, uppercase, letter-spacing 0.5 | Badges (PRO, POPULAR, BEST VALUE)                |
| `label`       | Inter            | 12 / 16            | 600, uppercase, letter-spacing 1   | "SETTINGS & MORE", "OR BEST DEAL", badges        |

## Spacing (4pt scale)

`xxs 4 · xs 8 · sm 12 · md 16 · lg 20 · xl 24 · xxl 32 · xxxl 40`. Screen gutter `md` (16). Section gap `xxl` (32).

## Radii

`sm 8` badges · `md 12` posters, thumbnails · `lg 16` cards, option rows · `xl 24` sheet · `pill 999` CTAs, chips.

## Elevation

- `glowPrimary`: shadow color `primary`, opacity 0.35, radius 16, offset 0/4. Primary CTAs.
- Cards are flat (border instead of shadow).

## Iconography

Lucide outline icons, stroke 2. Sizes: 16 (inline), 20 (buttons/rows), 24 (top bar, tab bar, action rail).

## Components (`src/components/ui`)

Browse them all in the dev-only kitchen sink (`/dev/kitchen-sink`, linked from the start screen in dev builds). It also has a "Simulate network errors" switch and "Reset demo".

| Component                                    | Props / variants                                                                                                                                                        | Notes                                                                                                                                                                                                                                                                              |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Text`                                       | `variant` (typography), `color: TextColor`, `align`                                                                                                                     | The only text primitive                                                                                                                                                                                                                                                            |
| `GradientText`                               | `variant`, `gradient`                                                                                                                                                   | Masked gradient fill ("Romance" heading, Buy label)                                                                                                                                                                                                                                |
| `Icon`                                       | `icon` (Lucide), `size: IconSize`, `color: IconColor`                                                                                                                   | Decorative; the parent carries the a11y label                                                                                                                                                                                                                                      |
| `PressableScale`                             | Pressable props + `haptic`                                                                                                                                              | Shared press feedback (scale 0.97 + fade, UI thread); haptics only on main CTAs                                                                                                                                                                                                    |
| `Button`                                     | `variant: primary \| secondary \| premium \| ghost`, `size: sm \| md \| lg`, `shape: pill \| rounded`, `icon`, `sublabel`, `loading`, `disabled`, `fullWidth`, `haptic` | primary = cyan + glow; secondary = dark outline; premium = gradient border + `buttonLarge` gradient label; disabled/loading dim to 50%                                                                                                                                             |
| `IconButton`                                 | `icon`, `accessibilityLabel` (required), `variant: filled \| outline \| ghost`, `size: md \| lg`, `selected`                                                            | Circle; touch area ≥ 44pt via hitSlop                                                                                                                                                                                                                                              |
| `Chip`                                       | `label`, `selected`, `onPress`                                                                                                                                          | Selected = cyan fill                                                                                                                                                                                                                                                               |
| `Tag`                                        | `label`, `variant: outline \| subtle`                                                                                                                                   | Non-interactive: genre tags, "Ep 5", counts                                                                                                                                                                                                                                        |
| `RadioIndicator`                             | `selected`                                                                                                                                                              | Visual only; the row has the radio role                                                                                                                                                                                                                                            |
| `Badge`                                      | `variant: pro \| spotlight \| popular \| bestValue \| locked`                                                                                                           | Translated labels; PRO and Best Value use the gradient (PRO has a crown); Spotlight is a soft violet pill                                                                                                                                                                          |
| `MetaRow`                                    | `items: { key, content }[]`                                                                                                                                             | Dot-separated meta                                                                                                                                                                                                                                                                 |
| `CoinAmount`                                 | `amount`, `variant`, `color`, `showIcon`                                                                                                                                | ⚡ + pluralised "Coins"                                                                                                                                                                                                                                                            |
| `Card`                                       | `variant: surface \| raised`, `selected`, `selectedTone: default \| brand`, `onPress`, `accessibilityRole`                                                              | Selected = cyan outline; brand tone = teal (coin pack)                                                                                                                                                                                                                             |
| `Avatar`                                     | `name`, `image?`, `size: sm \| md \| lg`                                                                                                                                | Initials when there is no photo                                                                                                                                                                                                                                                    |
| `PosterCard`                                 | `series`, `size: md \| lg`, `onPress`                                                                                                                                   | 2:3 poster, PRO badge, Eps · m/ep scrim, 2-line title; `recyclingKey`                                                                                                                                                                                                              |
| `SectionHeader`                              | `title`, `variant: h2 \| h3`, `accessory`, `actionLabel`, `onAction`                                                                                                    | "See all" in brand color                                                                                                                                                                                                                                                           |
| `Rail<T>`                                    | `data`, `renderItem`, `keyExtractor`, `height`                                                                                                                          | Horizontal FlashList, fixed height, gutter padding                                                                                                                                                                                                                                 |
| `Screen`                                     | `edges`                                                                                                                                                                 | Background; no safe-area padding by default (Header pads the top, lists use `useListBottomPadding`). Scrolling is the screen's list                                                                                                                                                |
| `Header`                                     | `variant: main \| secondary`, `left`, `right`, `title`, `scrollY`                                                                                                       | Same content height everywhere (56pt + top safe area). `main`: solid, takes its own space, title centered. `secondary`: floats over the content, title after `left`, transparent until scrolled, then fades to solid over one header height (`useHeaderScroll` provides `scrollY`) |
| `HeaderTitle`                                | `children`                                                                                                                                                              | The one header title style (`h2`, one line)                                                                                                                                                                                                                                        |
| `HeaderBackButton`                           |                                                                                                                                                                         | Standard `left` slot for `secondary`                                                                                                                                                                                                                                               |
| `LoadingState` / `ErrorState` / `EmptyState` | `message` / `error`, `onRetry` / `message`, `icon`                                                                                                                      | ErrorState: "not found" (no retry) vs "couldn't load" (retry) from `RepositoryError.kind`                                                                                                                                                                                          |

Layout hooks: `useHeaderHeight` (top padding for content under a floating header), `useHeaderScroll` (`{ scrollY, onScroll }`), `useListBottomPadding({ hasTabBar })` (end padding of every scrolling list).

Screen-specific pieces (Home category heading and hero, coin pack card and its price tag, season banner price pill, unlock option row, lock overlay, tab bar in `features/navigation`) live in their features. Prices inside pressable cards are plain labels, never buttons: the card is the touch target and carries the accessible label.
