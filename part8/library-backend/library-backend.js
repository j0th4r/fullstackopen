const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/use/ws');

const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const User = require('./src/models/user');

const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');

mongoose.set('strictQuery', false);

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({ server: httpServer, path: '/' });
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')) {
          const token = auth.replace('Bearer ', '');
          try {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            const user = await User.findById(decodedToken.id);
            return { currentUser: user };
          } catch (error) {
            throw new GraphQLError('invalid token', {
              extensions: {
                code: 'INVALID_',
              },
            });
          }
        }
        return { currentUser: null };
      },
    }),
  );
  const PORT = 4000;

  httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}`));
};

start();
