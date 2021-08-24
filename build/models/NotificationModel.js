"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var NotificationModel = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    liked_user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    }
}, { timestamps: true });
exports.default = mongoose_1.model('Notification', NotificationModel);
