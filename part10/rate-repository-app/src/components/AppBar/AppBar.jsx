import { StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import theme from '../../theme';
import AppBarTab from './AppBarTab';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.appBarBackground,
    paddingTop: Constants.statusBarHeight,
    flexGrow: 0,
  },
});

const AppBar = () => {
  return (
    <ScrollView style={styles.container} horizontal>
      <AppBarTab route="/">Repositories</AppBarTab>
      <AppBarTab route="/signin">Sign In</AppBarTab>
    </ScrollView>
  );
};

export default AppBar;
