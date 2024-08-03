import express from 'express';
import session from 'express-session';
import path from 'path';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import apiRouter from './Admin/routers/router';
import allCoinsRouter from './AllCoins/routers/AllCoinsRouter';
import authApiRouter from './Admin/routers/router';
import videoRoutes from './VideosStreaming/routes/videoRoutes';
import videoModificationRoutes from './VideosStreaming/routes/modification';
import invitationRoutes from './invite/Crud/routes/invitationRoutes';
import TeleGramBot from './Users/routes/UserRoutes';
import { isValidToken } from './Admin/Controller/authAdminContrller';
import { errorHandler } from './validations/Api/Telegram/errorhandling';
import morgan from 'morgan';
import http from 'http';



import { Server as SocketIOServer } from 'socket.io';

require('dotenv').config({ path: '.variables.env' });

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);
// Socket.IO connection handling (optional for standalone socket operations)
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Middleware
app.use(morgan('combined'));
// app.use(errorMiddleware);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET || 'default_secret', // Use the SECRET environment variable
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req: any, res: any, next: any) => {
  res.locals.admin = req.admin || null;
  res.locals.currentPath = req.path;
  next();
});

app.use(errorHandler);
// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header(
    'Access-Control-Allow-Headers',
    'Accept, Authorization,x-auth-token, Content-Type, X-Requested-With, Range'
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

// Routes
app.use('/api', authApiRouter); // Auth routes
app.use('/api', apiRouter); // API routes
app.use('/api', videoRoutes);
app.use('/api', TeleGramBot);
app.use('/api', invitationRoutes);
app.use('/api/modification', videoModificationRoutes);
app.use('/api', allCoinsRouter);

// for testing 
app.get('/', (req, res) => {
  res.send('Hello, this is the root endpoint!');
});


// Protected routes with token validation
app.use('/api', isValidToken, apiRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    result: null,
    message: 'Not Found',
  });
});

// Error handlers
if (app.get('env') === 'development') {
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      success: false,
      result: null,
      message: err.message,
    });
  });
}

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    result: null,
    message: 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
