import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers/UserResolver";
import { AppDataSource } from "./data-source";
import bodyParser from "body-parser";
import { verifyToken } from "./utils/auth";

const startServer = async () => {
  const app = express();

  app.use((req, _, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        const user = verifyToken(token);
        (req as any).userId = user.userId;
      } catch (err) {
        console.log(err);
      }
    }

    next();
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use("/graphql", bodyParser.json(), expressMiddleware(server));

  app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000/graphql");
  });
};

AppDataSource.initialize()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
