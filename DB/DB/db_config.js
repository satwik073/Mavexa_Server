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
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandlerReducer_1 = require("../../Middlewares/Error/ErrorHandlerReducer");
const ErrorHandlerReducer_2 = require("../../Middlewares/Error/ErrorHandlerReducer");
const connection_DB_estaiblished = (0, ErrorHandlerReducer_2.ASYNC_ERROR_HANDLER_ESTAIBLISHED)(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const url_session = ((_a = process.env.MONGO_DB_URL_ESTAIBLISHED) === null || _a === void 0 ? void 0 : _a.toString()) || '';
    yield (0, ErrorHandlerReducer_1.DATABASE_CONDTIONALS)(url_session);
}));
exports.default = connection_DB_estaiblished;
//# sourceMappingURL=db_config.js.map