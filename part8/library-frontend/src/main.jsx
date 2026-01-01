import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const authLink = new SetContextLink((preContext) => {
  const token = localStorage.getItem('user-token');
  return { headers: { ...preContext.headers, authorization: token ? `Bearer ${token}` : '' } };
});

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
    connectionParams: {
      authToken: localStorage.getItem('user-token'),
    },
  }),
);

const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
  connectToDevTools: true,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
);
