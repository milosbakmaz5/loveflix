import { Text } from './Text';

type HeaderTitleProps = {
  children: string;
};

/** The one title style for every Header. */
export function HeaderTitle({ children }: HeaderTitleProps) {
  return (
    <Text variant="h2" numberOfLines={1} accessibilityRole="header">
      {children}
    </Text>
  );
}
