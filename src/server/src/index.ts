import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { MongoClient } from 'mongodb';
import getUserFromToken from './utils/jwt/getUserFromToken';
import logger from './utils/logger';

const main = async () => {
  const app = express();
  const client = new MongoClient(process.env.DATABASE_URL as string, {
    maxPoolSize: 50,
  });

  await client.connect();

  const db = client.db('root');

  const apolloServer = new ApolloServer({
    typeDefs: ``,
    resolvers: {},
    context: async ({ req }) => {
      const user = await getUserFromToken(db, req.headers.authorization);
      return {
        db,
        user,
      };
    },
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
    path: '/api/graphql',
    __internal_healthCheckPath: '/api/health',
  });

  app.listen('8000', () => {
    logger.info('Server started on port 8000');
  });
};
main().catch(e => {
  logger.info(e);
});
