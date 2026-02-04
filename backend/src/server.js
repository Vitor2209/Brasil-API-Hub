import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import apiRoutes from './routes/api.routes.js';
import ibgeRoutes from './routes/ibge.routes.js';
import initChatSocket from './socket/chat.socket.js';

const app = express();
const server = http.createServer(app);

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Rotas */
app.use('/api', apiRoutes);
app.use('/api/ibge', ibgeRoutes);

/* Socket */
const io = new Server(server, {
  cors: { origin: '*' },
});

initChatSocket(io);

/* Porta */
const PORT = process.env.PORT || 8080;


