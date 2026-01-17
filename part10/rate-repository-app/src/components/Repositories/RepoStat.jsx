import { StyleSheet, View } from 'react-native';
import Text from '../Text';

const RepoStat = ({ children, statName }) => {
  return (
    <View style={styles.stat}>
      {children}
      <Text style={styles.text} color="textSecondary" fontSize="subheading">
        {statName}
      </Text>
    </View>
  );
};

export default RepoStat;

const styles = StyleSheet.create({
  stat: { alignItems: 'center' },
  text: {
    marginTop: 4,
  },
});
