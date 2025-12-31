const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

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

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: [args.author, args.title],
            error,
          },
        });
      }

      await book.populate('author');
      pubsub.publish('BOOK_ADDED', { bookAdded: book });
      return book;
    },
    editAuthor: async (root, args, context) => {
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
  Subscription: {
    bookAdded: {  
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
    },
  },
  Author: {
    bookCount: async (root) => {
      return await Book.countDocuments({ author: root._id });
    },
  },
};

module.exports = resolvers;
