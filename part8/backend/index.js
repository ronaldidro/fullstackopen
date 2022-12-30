const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

console.log("connecting to", process.env.MONGODB_URI);

mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const start = async () => {
  // Create an Express app and HTTP server; we will attach both the WebSocket server and the ApolloServer to this HTTP server.
  const app = express();
  const httpServer = createServer(app);
  // Create the schema, which will be used separately by ApolloServer and the WebSocket server.
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  // Create our WebSocket server using the HTTP server we just set up.
  const wsServer = new WebSocketServer({ server: httpServer, path: "/" });
  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer({ schema }, wsServer);
  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const decodedToken = jwt.verify(
          auth.substring(7),
          process.env.JWT_SECRET
        );
        const currentUser = await User.findById(decodedToken.id);
        return { currentUser };
      }
    },
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
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
  server.applyMiddleware({ app, path: "/" });
  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(process.env.PORT, () => {
    console.log(
      `Server is now running on http://localhost:${process.env.PORT}`
    );
  });
};

// Call the function that does the setup and starts the server
start();
