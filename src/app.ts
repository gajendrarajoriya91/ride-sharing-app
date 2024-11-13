import express, { Application } from 'express';
import createApolloServer from './graphql';
import bodyParser from 'body-parser';
import { authMiddleware } from './middlewares/auth.middleware';
import errorMiddleware from './middlewares/error.middleware';
import { Server as SocketIOServer } from 'socket.io';

const createApp = async (io: SocketIOServer): Promise<Application> => {
  if (!io) {
    throw new Error(
      'Socket.IO instance is required but missing. Ensure to pass io when calling createApp.',
    );
  }
  const app: Application = express();
  app.use(bodyParser.json());
  app.use(authMiddleware);
  app.use(errorMiddleware);

  const server = createApolloServer(io);

  try {
    await server.start();
    server.applyMiddleware({ app: app as any });
    // console.log('Apollo Server successfully started and middleware applied.');
  } catch (error) {
    console.error('Failed to start Apollo Server:', error);
    throw new Error('Failed to start Apollo Server.');
  }

  return app;
};

export default createApp;
