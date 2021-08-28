"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ActivityModel = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    subject: {
        type: String,
        required: true
    },
    haveFile: {
        type: Boolean,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });
exports.default = mongoose_1.model("Activity", ActivityModel);
