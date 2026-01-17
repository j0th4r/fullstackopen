import { Image, StyleSheet, View } from 'react-native';
import Text from '../Text';
import theme from '../../theme';

const RepoInfo = ({ avatar, fullName, description, language }) => {
  return (
    <>
      <View style={styles.infoSection}>
        <Image style={styles.avatar} source={{ uri: avatar }} />
        <View style={styles.details}>
          <Text style={styles.text} fontSize="subheading" fontWeight="bold">
            {fullName}
          </Text>
          <Text fontSize="subheading" color="textSecondary">
            {description}
          </Text>
        </View>
      </View>
      <Text style={styles.tag} fontSize="subheading">
        {language}
      </Text>
    </>
  );
};

export default RepoInfo;

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 4,
    height: 50,
    marginRight: 14,
    width: 50,
  },
  details: {
    flexDirection: 'column',
    flexShrink: 1,
    justifyContent: 'center',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'row',
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    color: theme.colors.textBar,
    marginLeft: 64,
    marginVertical: 10,
    padding: 4,
  },
  text: {
    marginBottom: 10,
  },
});
