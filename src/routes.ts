// @ts-ignore
import { Router, Request, Response } from "express";

import UserController from "./controllers/UserController";
import ActivityController from "./controllers/ActivityController";
import TokenController from "./controllers/TokenController";
import AuthController from "./controllers/AuthControllers";
import FileController from "./controllers/FileController";
import NotificationController from "./controllers/NotificationController";

import Multer from "./services/Multer";

const routes = Router();

routes.post('/signIn', AuthController.signIn);

routes.get('/user', UserController.index);
routes.post('/user', UserController.store);
routes.patch('/user/:token', UserController.update);

routes.get('/activity', AuthController.auth, ActivityController.index);
routes.get('/activity/:id', AuthController.auth, ActivityController.show);
routes.post('/activity', AuthController.auth, ActivityController.store);
routes.put('/activity/:id', AuthController.auth, ActivityController.update);
routes.patch('/activity/like/:id', AuthController.auth, ActivityController.like);
routes.delete('/activity/:id', AuthController.auth, ActivityController.delete);

routes.get('/notifications', AuthController.auth, NotificationController);

routes.post('/token', TokenController);

routes.post('/upload/:id', AuthController.auth, FileController, Multer.single('file'), (request: Request, response: Response) => response.sendStatus(204));

export default routes;

// apagar atividades periodicamente
