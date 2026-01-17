import { StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import theme from '../../theme';
import AppBarTab from './AppBarTab';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.appBarBackground,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: Constants.statusBarHeight,
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
