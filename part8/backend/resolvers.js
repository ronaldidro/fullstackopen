const { UserInputError, AuthenticationError } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");
const jwt = require("jsonwebtoken");
const pubsub = new PubSub();

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (Object.values(args).length === 0)
        return Book.find({}).populate("author");

      const author =
        args.author && (await Author.findOne({ name: args.author }));
      const byAuthor = author && { author: author._id };
      const byGenre = { genres: { $in: args.genre } };

      const byArgs = () => {
        if (args.author && args.genre) return { ...byAuthor, ...byGenre };
        if (args.author) return byAuthor;
        if (args.genre) return byGenre;
      };

      return Book.find(byArgs()).populate("author");
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: (root) => root.books.length,
  },
  Mutation: {
    addBook: async (root, args, context) => {
      try {
        const currentUser = context.currentUser;
        if (!currentUser) throw new AuthenticationError("not authenticated");

        let author = await Author.findOne({ name: args.author });

        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }

        const book = new Book({ ...args, author: author._id });
        await book.save();

        author.books = author.books.concat(book._id);
        await author.save();

        const savedBook = book.populate("author");

        pubsub.publish("BOOK_ADDED", { bookAdded: savedBook });

        return savedBook;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      try {
        if (!currentUser) throw new AuthenticationError("not authenticated");

        const author = await Author.findOne({ name: args.name });
        if (!author) return null;

        author.born = args.setBornTo;

        const updatedAuhtor = await author.save();
        return updatedAuhtor;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
    createUser: (root, args) => {
      const user = new User({ ...args });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secred") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]) },
  },
};

module.exports = resolvers;
