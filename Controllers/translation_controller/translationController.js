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
exports.translationConfigSettings = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const structure_1 = require("../../Common/structure");
const ErrorHandlerReducer_1 = require("../../Middlewares/Error/ErrorHandlerReducer");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
exports.translationConfigSettings = (0, ErrorHandlerReducer_1.ASYNC_ERROR_HANDLER_ESTAIBLISHED)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { languageSelector } = request.params;
    const translationSupport = {
        [structure_1.ISO_Structures.ISO_639_EIN]: structure_1.JSON_PACKETS.ISO_639_EIN,
        [structure_1.ISO_Structures.ISO_723_HIN]: structure_1.JSON_PACKETS.ISO_723_HIN,
        [structure_1.ISO_Structures.ISO_812_FRN]: structure_1.JSON_PACKETS.ISO_812_FRN,
    };
    if (languageSelector && languageSelector in translationSupport) {
        const filePath = path_1.default.join(__dirname, '../..', 'Translations', translationSupport[languageSelector]);
        console.log("path", filePath);
        if (fs_1.default.existsSync(filePath)) {
            const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
            console.log(fileContent);
            return response.json(JSON.parse(fileContent));
        }
        else {
            return response.status(http_status_codes_1.default.NOT_FOUND).json({ error: 'Translation file not found.' });
        }
    }
    else {
        console.log(`Invalid language selector: ${languageSelector}`);
        return response.status(http_status_codes_1.default.METHOD_NOT_ALLOWED).json({ error: 'Invalid language selector.' });
    }
}));
//# sourceMappingURL=translationController.js.map