import { StyleSheet, View } from 'react-native';
import Text from '../Text';
import RepoStat from './RepoStat';

const RepoStats = ({ stars, forks, reviews, rating }) => {
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <View style={styles.stats}>
      <RepoStat statName="Stars">
        <Text fontWeight="bold" fontSize="subheading">
          {formatNumber(stars)}
        </Text>
      </RepoStat>
      <RepoStat statName="Forks">
        <Text fontWeight="bold" fontSize="subheading">
          {formatNumber(forks)}
        </Text>
      </RepoStat>
      <RepoStat statName="Reviews">
        <Text fontWeight="bold" fontSize="subheading">
          {formatNumber(reviews)}
        </Text>
      </RepoStat>
      <RepoStat statName="Rating">
        <Text fontWeight="bold" fontSize="subheading">
          {rating}
        </Text>
      </RepoStat>
    </View>
  );
};

export default RepoStats;

const styles = StyleSheet.create({
  stats: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
