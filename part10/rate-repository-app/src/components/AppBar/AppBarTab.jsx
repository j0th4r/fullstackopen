import { Pressable, StyleSheet } from 'react-native';
import Text from '../Text';
import { Link } from 'react-router-native';

const styles = StyleSheet.create({
  tab: {
    padding: 16,
  },
});

const AppBarTab = ({ children, route }) => {
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
