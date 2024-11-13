import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { verifyToken } from './utils/jwt';
import { Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';

const createApolloServer = (io?: SocketIOServer) => {
  if (!io) {
    console.error('Socket.IO instance is missing.');
  }
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }: { req: Request; res: Response }) => {
      const token = req.headers.authorization?.replace('Bearer ', '');

      let user = null;
      if (token) {
        try {
          user = verifyToken(token);
        } catch (err) {
          console.error('Invalid token:', err);
          res.status(401).send({ error: 'Invalid token' });
        }
      }

      return {
        user,
        req,
        res,
        io,
      };
    },
  });
};

export default createApolloServer;
