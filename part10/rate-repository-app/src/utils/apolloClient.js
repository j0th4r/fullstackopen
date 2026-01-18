import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://192.168.1.4:4000/graphql',
});

const createApolloClient = () => {
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
