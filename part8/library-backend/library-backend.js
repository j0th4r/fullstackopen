const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { v1: uuid } = require('uuid'); // ...
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Book = require('./src/models/book');
const Author = require('./src/models/author');

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
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
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
      //   return books.filter((book) => book.author === args.author);
      // }

      // if (args.genre) {
      //   return books.filter((book) => book.genres.includes(args.genre));
      // }

      return Book.find({}).populate('author');
    },
    allAuthors: async () => {
      // return authors.map((author) => {
      //   const bookCount = books.filter(
      //     (book) => book.author === author.name
      //   ).length;
      //   return { ...author, bookCount };
      // })

      return Author.find({})
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author, id: uuid() });
        await author.save()
      }

      const book = new Book({ ...args, id: uuid(), author });
      return book.save();
    },
    // editAuthor: (root, args) => {
    //   const author = authors.find((author) => author.name === args.name);

    //   if (!author) {
    //     return null;
    //   }

    //   author.born = args.setBornTo;

    //   return author;
    // },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
