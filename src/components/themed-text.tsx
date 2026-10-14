import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'defaultSemiBold'
    | 'title'
    | 'hero'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code'
    | 'caption';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'title' && styles.title,
        type === 'hero' && styles.hero,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        type === 'caption' && styles.caption,
        style,
      ]}
      {...rest}
    />
  );
}

const fontPlatform = (fontName: string) =>
  Platform.select({
    web: { fontFamily: "'Outfit', sans-serif" },
    default: { fontFamily: fontName },
  });

const styles = StyleSheet.create({
  hero: {
    ...fontPlatform(Fonts.bold),
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  title: {
    ...fontPlatform(Fonts.bold),
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    ...fontPlatform(Fonts.semiBold),
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
  },
  defaultSemiBold: {
    ...fontPlatform(Fonts.semiBold),
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  default: {
    ...fontPlatform(Fonts.regular),
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  small: {
    ...fontPlatform(Fonts.regular),
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  smallBold: {
    ...fontPlatform(Fonts.semiBold),
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  caption: {
    ...fontPlatform(Fonts.medium),
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  link: {
    ...fontPlatform(Fonts.medium),
    fontSize: 14,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  linkPrimary: {
    ...fontPlatform(Fonts.semiBold),
    fontSize: 14,
    lineHeight: 20,
    color: '#1E40AF',
  },
  code: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    lineHeight: 16,
  },
});
