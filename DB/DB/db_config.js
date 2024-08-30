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
const mongoose_1 = __importDefault(require("mongoose"));
const connection_DB_estaiblished = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url_session = process.env.MONGO_DB_URL_ESTAIBLISHED;
        if (!url_session)
            throw new Error('MONGO_DB_URL_ESTAIBLISHED is not defined in environment variables');
        yield mongoose_1.default.connect(url_session).then(() => {
            console.log("Connection successfuly estaiblished between client and server");
        }).catch((error_value_displayed) => {
            console.log(error_value_displayed, "Connection between client and server can't be estaiblished");
        });
    }
    catch (_a) {
        console.log("Something went wrong");
    }
});
exports.default = connection_DB_estaiblished;
//# sourceMappingURL=db_config.js.map