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
var bcrypt_1 = __importDefault(require("bcrypt"));
var UserModel_1 = __importDefault(require("../models/UserModel"));
var TokenModel_1 = __importDefault(require("../models/TokenModel"));
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.index = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var users, _i, users_1, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, UserModel_1.default.find().sort('-likes')];
                    case 1:
                        users = _a.sent();
                        for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                            user = users_1[_i];
                            user.password = undefined;
                        }
                        return [2 /*return*/, response.json(users)];
                }
            });
        });
    };
    UserController.prototype.store = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, username, password, email, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, username = _a.username, password = _a.password, email = _a.email;
                        return [4 /*yield*/, UserModel_1.default.create({
                                username: username,
                                password: password,
                                email: email,
                                likes: 0
                            })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            response.status(400).json({ message: 'failed to create user!' });
                        }
                        user.password = undefined;
                        return [2 /*return*/, response.json({
                                message: 'user created successfully!',
                                user: user
                            })];
                }
            });
        });
    };
    UserController.prototype.update = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var password, token, user, password_encrypted, user_updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = request.body.password;
                        token = request.params.token;
                        return [4 /*yield*/, TokenModel_1.default.findById(token)];
                    case 1:
                        user = (_a.sent()).user;
                        return [4 /*yield*/, TokenModel_1.default.findByIdAndDelete(token)];
                    case 2:
                        _a.sent();
                        if (!user) {
                            return [2 /*return*/, response.status(404).json({ message: 'user not found!' })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 3:
                        password_encrypted = _a.sent();
                        return [4 /*yield*/, UserModel_1.default.findByIdAndUpdate(user._id, { password: password_encrypted })];
                    case 4:
                        user_updated = _a.sent();
                        if (!user_updated) {
                            return [2 /*return*/, response.status(400).json({ message: 'failed to update user!' })];
                        }
                        user_updated.password = undefined;
                        return [2 /*return*/, response.json({
                                message: 'user updated successfully!',
                                previous_user: user_updated
                            })];
                }
            });
        });
    };
    return UserController;
}());
exports.default = new UserController();
