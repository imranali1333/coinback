import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Your other routes and middleware setup

// Emit Socket.IO event for balance update
export function emitCoinsUpdated(userId: number, updatedBalance: number): void {
  io.emit('coinsUpdated', {
    userId: userId,
    balance: updatedBalance,
  });
}

export default server;
