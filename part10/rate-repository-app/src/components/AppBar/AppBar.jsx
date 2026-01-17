import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Text from './Text';
import { useFormik } from 'formik';
import theme from '../theme';

const SignIn = () => {
  const initialValues = {
    username: '',
    password: '',
  };

  const onSubmit = (values) => {
    console.log(values);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formik.values.height}
        onChangeText={formik.handleChange('password')}
        secureTextEntry
      />
      <Pressable style={styles.submitBtn} onPress={formik.handleSubmit}>
        <Text fontSize="subheading" fontWeight="bold" color="textBar">
          Sign in
        </Text>
      </Pressable>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.formBg,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B8B8B8',
    borderRadius: 4,
    padding: 16,
    fontSize: theme.fontSizes.subheading,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    padding: 16,
    justifyContent: 'center',
  },
});
