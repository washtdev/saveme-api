"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var socketIo = __importStar(require("socket.io"));
var cors_1 = __importDefault(require("cors"));
var https_1 = __importDefault(require("https"));
var path_1 = require("path");
require("dotenv/config");
var routes_1 = __importDefault(require("./routes"));
var app = express_1.default();
var server = https_1.default.createServer(app);
exports.io = new socketIo.Server(server, {
    cors: {
        origin: '*'
    }
});
mongoose_1.default.connect(process.env["DATABASE_CONNECT"], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(function () { return console.log('MongoDB Connected!'); });
app.use(cors_1.default());
app.use('/files', express_1.default.static(path_1.resolve(__dirname, '..', 'tmp')));
app.use(express_1.default.json());
app.use(routes_1.default);
server.listen(3333, function () { return console.log('Server Running...'); }); //hello
