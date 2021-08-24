import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import * as socketIo from "socket.io";
import cors from "cors";

import http from "http";
import { resolve } from "path";

import "dotenv/config";

import routes from "./routes";

const app = express();
const server = http.createServer(app);
export const io = new socketIo.Server(server, {
  cors: {
    origin: '*'
  }
});

mongoose.connect(process.env["DATABASE_CONNECT"]!, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true 
}).then(() => console.log('MongoDB Connected!'));

app.use(cors({
  origin: '*'
}));
app.use('/files', express.static(resolve(__dirname, '..', 'tmp')));
app.use(express.json());
app.use(routes);

server.listen(3333, () => console.log('Server Running...'));