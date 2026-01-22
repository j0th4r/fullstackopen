import { Pressable, StyleSheet } from 'react-native';
import Text from '../Text';
import { Link } from 'react-router-native';

const styles = StyleSheet.create({
  tab: {
    padding: 16,
  },
});

const AppBarTab = ({ children, route, onPress }) => {
  // If onPress is provided, use Pressable without Link
  if (onPress) {
    return (
      <Pressable style={styles.tab} onPress={onPress}>
        <Text color="textBar" fontWeight="bold" fontSize="subheading">
          {children}
        </Text>
      </Pressable>
    );
  }

  // Otherwise, use Link for navigation
  return (
    <Pressable style={styles.tab}>
      <Link to={route}>
        <Text color="textBar" fontWeight="bold" fontSize="subheading">
          {children}
        </Text>
      </Link>
    </Pressable>
  );
};

export default AppBarTab;
