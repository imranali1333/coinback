import { Server, Socket } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new Server(server);

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

export function emitCoinsUpdated(userId: number, updatedBalance: number): void {
  io.emit('coinsUpdated', {
    userId: userId,
    balance: updatedBalance,
  });
}

export default server;
