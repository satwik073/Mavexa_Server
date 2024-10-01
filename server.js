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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./Common/instrument");
const userRouter_1 = __importDefault(require("./Routes/user_routers/userRouter"));
const adminRoutes_1 = __importDefault(require("./Routes/admin_routes/adminRoutes"));
const db_config_1 = __importDefault(require("./DB/DB/db_config"));
const Sentry = require("@sentry/node");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
(0, db_config_1.default)();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT_ESTAIBLISHED = process.env.PORT_ESTAIBLISHED || 8000;
app.use('/api/v1/', userRouter_1.default);
app.use('/api/v1/controls', adminRoutes_1.default);
Sentry.setupExpressErrorHandler(app);
app.listen(PORT_ESTAIBLISHED, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running successfully on port ${PORT_ESTAIBLISHED}`);
}));
//# sourceMappingURL=server.js.map