import { createTransport } from "nodemailer";

import "dotenv/config";

export default createTransport({
    service: 'gmail',
    host: 'stmp.gmail.com',
    auth: {
        user: process.env["EMAIL"],
        pass: process.env["PASSWORD"]
    }
});