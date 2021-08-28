"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var express_1 = require("express");
var UserController_1 = __importDefault(require("./controllers/UserController"));
var ActivityController_1 = __importDefault(require("./controllers/ActivityController"));
var TokenController_1 = __importDefault(require("./controllers/TokenController"));
var AuthControllers_1 = __importDefault(require("./controllers/AuthControllers"));
var FileController_1 = __importDefault(require("./controllers/FileController"));
var NotificationController_1 = __importDefault(require("./controllers/NotificationController"));
var ActivityModel_1 = __importDefault(require("./models/ActivityModel"));
var Multer_1 = __importDefault(require("./services/Multer"));
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
routes.post('/upload/:id', AuthControllers_1.default.auth, FileController_1.default, Multer_1.default.single('file'), function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, location;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = request.userId;
                location = request.file.location;
                return [4 /*yield*/, ActivityModel_1.default.findByIdAndUpdate(userId, { url: location })];
            case 1:
                _a.sent();
                response.sendStatus(204);
                return [2 /*return*/];
        }
    });
}); });
exports.default = routes;
// apagar atividades periodicamente
