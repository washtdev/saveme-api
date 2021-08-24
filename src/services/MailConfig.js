"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer_1 = require("nodemailer");
require("dotenv/config");
exports.default = nodemailer_1.createTransport({
    service: 'gmail',
    host: 'stmp.gmail.com',
    auth: {
        user: process.env["EMAIL"],
        pass: process.env["PASSWORD"]
    }
});
