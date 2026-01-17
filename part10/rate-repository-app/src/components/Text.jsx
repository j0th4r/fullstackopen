import { Text as NativeText, StyleSheet } from 'react-native';

import theme from '../theme';

const styles = StyleSheet.create({
  colorPrimary: {
    color: theme.colors.primary,
  },
  colorTextBar: {
    color: theme.colors.textBar,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  colorError: {
    color: theme.colors.error,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
  text: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.main,
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.normal,
  },
});

const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.text,
    color === 'textSecondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    color === 'textBar' && styles.colorTextBar,
    color === 'error' && styles.colorError,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style,
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
