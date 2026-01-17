import { TextInput as NativeTextInput, StyleSheet } from 'react-native';

import theme from '../theme';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
    padding: 16,
    fontSize: theme.fontSizes.subheading,
  },
  error: {
    borderColor: theme.colors.error,
  },
});

const TextInput = ({ error, ...props }) => {
  const style = [styles.input, error && styles.error];

  return <NativeTextInput style={style} {...props} />;
};

export default TextInput;
