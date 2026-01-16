import { Pressable, StyleSheet } from 'react-native';
import Text from '../Text';

const styles = StyleSheet.create({
  tab: {
    padding: 16,
  },
});

const AppBarTab = () => {
  return (
    <Pressable style={styles.tab}>
      <Text color="textBar" fontWeight="bold" fontSize="subheading">
        Repositories
      </Text>
    </Pressable>
  );
};

export default AppBarTab;
