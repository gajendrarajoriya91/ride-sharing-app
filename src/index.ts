import dotenv from 'dotenv';
dotenv.config();
import createApp from './app';
import connectDB from './config/database';
import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import { verifyToken } from './utils/jwt';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = http.createServer();

    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['POST'],
      },
    });

    const app = await createApp(io);
    httpServer.on('request', app);

    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      try {
        const user = verifyToken(token);
        socket.data.user = user;
        next();
      } catch (err) {
        next(new Error('Invalid token'));
      }
    });

    io.on('connection', (socket) => {
      // console.log(`User connected: ${socket.data.user?.id}`);

      socket.on('disconnect', () => {
        // console.log(`User disconnected: ${socket.data.user?.id}`);
      });
    });

    // Start the server
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
