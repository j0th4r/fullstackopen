import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import theme from '../../theme';
import RepoInfo from './RepoInfo';
import RepoStats from './RepoStats';

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.repoItemBg,
    padding: 14,
  },
});

const RepositoryItem = ({ repository }) => {
  return (
    <View style={styles.background}>
      <RepoInfo
        avatar={repository.ownerAvatarUrl}
        fullName={repository.fullName}
        description={repository.description}
        language={repository.language}
      />
      <RepoStats
        stars={repository.stargazersCount}
        forks={repository.forksCount}
        reviews={repository.reviewCount}
        rating={repository.ratingAverage}
      />
    </View>
  );
};

export default RepositoryItem;
