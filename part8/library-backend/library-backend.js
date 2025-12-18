const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { v1: uuid } = require('uuid'); // ...
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Book = require('./src/models/book');
const Author = require('./src/models/author');
const User = require('./src/models/user');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

require('dotenv').config();

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

const typeDefs = /* GraphQL */ `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // if (args.author && args.genre) {
      //   return books.filter(
      //     (book) =>
      //       book.author === args.author && book.genres.includes(args.genre)
      //   );
      // }

      // if (args.author) {
      //   const books = Book.find({}).populate('author')
      // }

      if (args.genre) {
        return Book.find({ genres: args.genre }).populate('author');
      }

      return Book.find({}).populate('author');
    },
    allAuthors: async () => {
      // return authors.map((author) => {
      //   const bookCount = books.filter(
      //     (book) => book.author === author.name
      //   ).length;
      //   return { ...author, bookCount };
      // })

      return Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      try {
        const currentUser = context.currentUser;

        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        let author = await Author.findOne({ name: args.author });

        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }

        const book = new Book({ ...args, author });

        return await book.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: [args.author, args.title],
            error,
          },
        });
      }
    },
    editAuthor: async (root, args) => {
      try {
        const currentUser = context.currentUser;

        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        const author = await Author.findOne({ name: args.name });

        if (!author) {
          return null;
        }

        author.born = args.setBornTo;

        return await author.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
            error,
          },
        });
      }
    },
    createUser: async (root, args) => {
      try {
        const user = new User({ ...args });
        return await user.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: [args.username, args.favoriteGenre],
            error,
          },
        });
      }
    },
    login: async (root, args) => {
      try {
        let user = await User.findOne({ username: args.username });

        if (!user || args.password !== 'secret') {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          });
        }

        const userForToken = {
          username: user.username,
          id: user._id,
        };

        const token = jwt.sign(userForToken, process.env.SECRET, {
          expiresIn: 60 * 60,
        });

        return { value: token };
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        });
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
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
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
