import { Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import TextInput from './TextInput';
import { useFormik } from 'formik';
import * as yup from 'yup';
import theme from '../theme';

const SignIn = () => {
  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const errUserName = formik.touched.username && formik.errors.username;
  const errPassword = formik.touched.password && formik.errors.password;

  return (
    <View style={styles.container}>
      <TextInput
        error={errUserName}
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
      />
      {errUserName && <Text color="error">{formik.errors.username}</Text>}
      <TextInput
        error={errPassword}
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        secureTextEntry
      />
      {errPassword && <Text color="error">{formik.errors.password}</Text>}
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
    gap: 12,
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },
});
