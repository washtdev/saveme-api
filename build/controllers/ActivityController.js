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
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var index_1 = require("../index");
var ActivityModel_1 = __importDefault(require("../models/ActivityModel"));
var UserModel_1 = __importDefault(require("../models/UserModel"));
var NotificationModel_1 = __importDefault(require("../models/NotificationModel"));
var s3 = new aws_sdk_1.default.S3();
var ActivityController = /** @class */ (function () {
    function ActivityController() {
    }
    ActivityController.prototype.index = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, title, subject, page, exact_page, activities, _i, activities_1, activity, count;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.query, title = _a.title, subject = _a.subject, page = _a.page;
                        exact_page = page || 0;
                        if (!!subject) return [3 /*break*/, 4];
                        if (!!title) return [3 /*break*/, 2];
                        return [4 /*yield*/, ActivityModel_1.default.find().sort('-createdAt').populate('user').skip((exact_page - 1) * 10).limit(10)];
                    case 1:
                        activities = (_b.sent());
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, ActivityModel_1.default.find({ title: new RegExp('^' + title) }).sort('-createdAt').populate('user')];
                    case 3:
                        activities = (_b.sent());
                        _b.label = 4;
                    case 4:
                        if (!!activities) return [3 /*break*/, 8];
                        if (!!title) return [3 /*break*/, 6];
                        return [4 /*yield*/, ActivityModel_1.default.find({ subject: subject }).sort('-createdAt').populate('user').skip((exact_page - 1) * 10).limit(10)];
                    case 5:
                        activities = (_b.sent());
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, ActivityModel_1.default.find({ subject: subject, title: new RegExp('^' + title) }).sort('-createdAt').populate('user')];
                    case 7:
                        activities = (_b.sent());
                        _b.label = 8;
                    case 8:
                        for (_i = 0, activities_1 = activities; _i < activities_1.length; _i++) {
                            activity = activities_1[_i];
                            activity.user.password = undefined;
                        }
                        return [4 /*yield*/, ActivityModel_1.default.estimatedDocumentCount()];
                    case 9:
                        count = _b.sent();
                        return [2 /*return*/, response.json({
                                activities: activities,
                                pages: Math.ceil(count / 10)
                            })];
                }
            });
        });
    };
    ActivityController.prototype.show = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var id, activity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = request.params.id;
                        return [4 /*yield*/, ActivityModel_1.default.findById(id).populate('user')];
                    case 1:
                        activity = _a.sent();
                        if (!activity) {
                            return [2 /*return*/, response.status(404).json({ message: 'activity not found!' })];
                        }
                        activity.user.password = undefined;
                        return [2 /*return*/, response.json(activity)];
                }
            });
        });
    };
    ActivityController.prototype.store = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, title, description, subject, haveFile, userId, activity_create, activity;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, title = _a.title, description = _a.description, subject = _a.subject, haveFile = _a.haveFile;
                        userId = request.userId;
                        return [4 /*yield*/, ActivityModel_1.default.create({
                                user: userId,
                                title: title,
                                description: description,
                                subject: subject,
                                haveFile: haveFile,
                                url: '',
                                likes: []
                            })];
                    case 1:
                        activity_create = _b.sent();
                        return [4 /*yield*/, ActivityModel_1.default.findById(activity_create._id).populate('user')];
                    case 2:
                        activity = _b.sent();
                        if (!activity) {
                            return [2 /*return*/, response.status(400).json({ message: 'failed to create activity!' })];
                        }
                        activity.user.password = undefined;
                        index_1.io.emit('activity', activity);
                        return [2 /*return*/, response.json({
                                message: 'activity created successfully!',
                                activity: activity
                            })];
                }
            });
        });
    };
    ActivityController.prototype.update = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var body, id, userId, activity, previous_activity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = request.body;
                        id = request.params.id;
                        userId = request.userId;
                        return [4 /*yield*/, ActivityModel_1.default.findById(id).populate('user')];
                    case 1:
                        activity = _a.sent();
                        if (!activity) {
                            return [2 /*return*/, response.status(404).json({ message: 'activity not found!' })];
                        }
                        if (!(activity.user._id == userId)) {
                            return [2 /*return*/, response.status(403).json({ message: 'unauthorized user to update activity' })];
                        }
                        if (!activity.haveFile) return [3 /*break*/, 3];
                        /*unlinkSync(resolve(__dirname, '..', '..', 'tmp', activity._id + '.pdf'));*/
                        return [4 /*yield*/, s3.deleteObject({
                                Bucket: 'saveme',
                                Key: activity._id + '.pdf'
                            })];
                    case 2:
                        /*unlinkSync(resolve(__dirname, '..', '..', 'tmp', activity._id + '.pdf'));*/
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, ActivityModel_1.default.findByIdAndUpdate(id, body).populate('user')];
                    case 4:
                        previous_activity = _a.sent();
                        index_1.io.emit('update activity', activity);
                        return [2 /*return*/, response.json(activity)];
                }
            });
        });
    };
    ActivityController.prototype.like = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userId, likes, activity_updated, liked_user, user, like;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = request.params.id;
                        userId = request.userId;
                        return [4 /*yield*/, ActivityModel_1.default.findById(id)];
                    case 1:
                        likes = (_a.sent()).likes;
                        return [4 /*yield*/, ActivityModel_1.default.findByIdAndUpdate(id, likes.includes(userId) ? { $pull: { likes: userId } } : { $push: { likes: userId } }).populate('user')];
                    case 2:
                        activity_updated = _a.sent();
                        if (!activity_updated) {
                            return [2 /*return*/, response.status(400).json({ message: 'failed to update activity!' })];
                        }
                        return [4 /*yield*/, UserModel_1.default.findById(userId)];
                    case 3:
                        liked_user = _a.sent();
                        if (!likes.includes(userId)) return [3 /*break*/, 6];
                        return [4 /*yield*/, UserModel_1.default.findById(activity_updated.user._id)];
                    case 4:
                        user = (_a.sent());
                        user.likes--;
                        return [4 /*yield*/, UserModel_1.default.findByIdAndUpdate(user._id, { likes: user.likes })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 6: return [4 /*yield*/, UserModel_1.default.findById(activity_updated.user._id)];
                    case 7:
                        user = (_a.sent());
                        user.likes++;
                        return [4 /*yield*/, UserModel_1.default.findByIdAndUpdate(user._id, { likes: user.likes })];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, NotificationModel_1.default.create({
                                author: user._id,
                                liked_user: liked_user._id,
                                activity: activity_updated._id
                            })];
                    case 9:
                        like = _a.sent();
                        index_1.io.emit('like', like);
                        _a.label = 10;
                    case 10:
                        activity_updated.user.password = undefined;
                        return [2 /*return*/, response.json({
                                message: 'activity updated successfully!',
                                previous_activity: activity_updated
                            })];
                }
            });
        });
    };
    ActivityController.prototype.delete = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userId, activity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = request.params.id;
                        userId = request.userId;
                        return [4 /*yield*/, ActivityModel_1.default.findById(id)];
                    case 1:
                        activity = _a.sent();
                        if (!activity) {
                            return [2 /*return*/, response.status(400).json({ message: 'failed to delete activity!' })];
                        }
                        if (!(activity.user._id == userId)) {
                            return [2 /*return*/, response.status(403).json({ message: 'unauthorized user to delete activity!' })];
                        }
                        return [4 /*yield*/, ActivityModel_1.default.findByIdAndDelete(id)];
                    case 2:
                        _a.sent();
                        if (!activity.haveFile) return [3 /*break*/, 4];
                        return [4 /*yield*/, s3.deleteObject({
                                Bucket: 'saveme',
                                Key: activity._id + '.pdf'
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        index_1.io.emit('delete activity', activity);
                        return [2 /*return*/, response.status(204).send()];
                }
            });
        });
    };
    return ActivityController;
}());
exports.default = new ActivityController();
