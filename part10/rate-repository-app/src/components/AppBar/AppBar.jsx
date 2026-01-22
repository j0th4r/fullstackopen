import { StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client/react';
import Constants from 'expo-constants';
import theme from '../../theme';
import AppBarTab from './AppBarTab';
import { ME } from '../../graphql/queries';
import useSignOut from '../../hooks/useSignOut';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.appBarBackground,
    paddingTop: Constants.statusBarHeight,
    flexGrow: 0,
    flexShrink: 0,
  },
});

const AppBar = () => {
  const { data } = useQuery(ME);
  const signOut = useSignOut();
  const signedIn = data?.me;

  return (
    <ScrollView style={styles.container} horizontal>
      <AppBarTab route="/">Repositories</AppBarTab>
      {signedIn ? (
        <AppBarTab onPress={signOut}>Sign Out</AppBarTab>
      ) : (
        <AppBarTab route="/signin">Sign In</AppBarTab>
      )}
    </ScrollView>
  );
};

export default AppBar;
