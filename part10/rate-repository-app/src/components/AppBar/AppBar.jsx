import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import theme from '../../theme';
import AppBarTab from './AppBarTab';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.appBarBackground,
    paddingTop: Constants.statusBarHeight,
  },
});

const AppBar = () => {
  return <View style={styles.container}><AppBarTab /></View>;
};

export default AppBar;
