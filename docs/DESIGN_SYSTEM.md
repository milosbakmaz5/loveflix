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

| Variant      | Font             | Size / line height | Weight                           | Usage                                     |
| ------------ | ---------------- | ------------------ | -------------------------------- | ----------------------------------------- |
| `display`    | Playfair Display | 32 / 38            | 700                              | Hero title                                |
| `h1`         | Playfair Display | 24 / 30            | 700                              | Screen titles, sheet title                |
| `h2`         | Playfair Display | 20 / 26            | 700                              | Section titles ("Trending Romance")       |
| `h3`         | Playfair Display | 16 / 22            | 600                              | Card & episode titles                     |
| `body`       | Inter            | 15 / 22            | 400                              | Body text, synopsis                       |
| `bodyStrong` | Inter            | 15 / 22            | 600                              | Button labels, option titles              |
| `bodySmall`  | Inter            | 13 / 18            | 400                              | Meta, subtitles                           |
| `caption`    | Inter            | 11 / 14            | 500                              | Poster meta, tab labels                   |
| `label`      | Inter            | 12 / 16            | 600, uppercase, letter-spacing 1 | "SETTINGS & MORE", "OR BEST DEAL", badges |

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

| Component                                    | Props / variants                                                                                                              | Notes                                                               |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `Text`                                       | `variant` (see typography), `color` token, `numberOfLines`                                                                    | The only text primitive                                             |
| `Button`                                     | `variant: primary \| secondary \| outline \| ghost \| gradient`, `size: md \| lg`, `icon`, `loading`, `disabled`, `fullWidth` | Pill shape; primary has `glowPrimary`; lg = 52 high, md = 40        |
| `IconButton`                                 | `variant: filled \| outline \| ghost`, `size: md \| lg`, `icon`, `label` (a11y)                                               | Circle; ≥ 44pt hit area                                             |
| `Chip`                                       | `label`, `selected`, `onPress`                                                                                                | Selected = `primary` bg + `onPrimary` text; else `surface` + border |
| `Badge`                                      | `variant: pro \| spotlight \| new \| completed \| popular \| bestValue \| locked`                                             | Small, `label` text style                                           |
| `Card`                                       | `selected`, `padding`, `children`                                                                                             | `surface` + border, radius `lg`                                     |
| `PosterCard`                                 | `size: sm \| md \| lg`, `imageUri`, `title`, `episodes`, `minutesPerEp`, `isPro`, `onPress`                                   | 2:3 poster, bottom meta scrim, title below in `h3`                  |
| `SectionHeader`                              | `title`, `actionLabel?`, `onAction?`                                                                                          | Title `h2` + `primary` "See all"                                    |
| `Rail`                                       | `data`, `renderItem`, `keyExtractor`, `itemWidth`, `height`                                                                   | Horizontal FlashList with gutter padding                            |
| `ListRow`                                    | `icon`, `title`, `onPress`, `chevron`                                                                                         | Icon in rounded `surfaceRaised` square                              |
| `Avatar`                                     | `uri`, `size`, `label?`, `sublabel?`                                                                                          | Circle                                                              |
| `Screen`                                     | `edges`, `scroll?`, `children`                                                                                                | Safe area + `bg`                                                    |
| `LoadingState` / `ErrorState` / `EmptyState` | `message`, `onRetry?`                                                                                                         | Query states                                                        |
| `TabBar`                                     | expo-router tab bar props                                                                                                     | Home, Discover, Romance, Library, Profile; active = `primary`       |
