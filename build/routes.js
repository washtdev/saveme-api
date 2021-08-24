"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var express_1 = require("express");
var UserController_1 = __importDefault(require("@controllers/UserController"));
var ActivityController_1 = __importDefault(require("@controllers/ActivityController"));
var TokenController_1 = __importDefault(require("@controllers/TokenController"));
var AuthControllers_1 = __importDefault(require("@controllers/AuthControllers"));
var FileController_1 = __importDefault(require("@controllers/FileController"));
var NotificationController_1 = __importDefault(require("@controllers/NotificationController"));
var Multer_1 = __importDefault(require("@services/Multer"));
var routes = express_1.Router();
routes.post('/signIn', AuthControllers_1.default.signIn);
routes.get('/user', UserController_1.default.index);
routes.post('/user', UserController_1.default.store);
routes.patch('/user/:token', UserController_1.default.update);
routes.get('/activity', AuthControllers_1.default.auth, ActivityController_1.default.index);
routes.get('/activity/:id', AuthControllers_1.default.auth, ActivityController_1.default.show);
routes.post('/activity', AuthControllers_1.default.auth, ActivityController_1.default.store);
routes.put('/activity/:id', AuthControllers_1.default.auth, ActivityController_1.default.update);
routes.patch('/activity/like/:id', AuthControllers_1.default.auth, ActivityController_1.default.like);
routes.delete('/activity/:id', AuthControllers_1.default.auth, ActivityController_1.default.delete);
routes.get('/notifications', AuthControllers_1.default.auth, NotificationController_1.default);
routes.post('/token', TokenController_1.default);
routes.post('/upload/:id', AuthControllers_1.default.auth, FileController_1.default, Multer_1.default.single('file'), function (request, response) { return response.sendStatus(204); });
exports.default = routes;
// apagar atividades periodicamente
