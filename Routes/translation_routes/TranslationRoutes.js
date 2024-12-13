"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const translationController_1 = require("../../Controllers/translation_controller/translationController");
const router = (0, express_1.Router)();
router.get('/ISO/:languageSelector', translationController_1.translationConfigSettings);
exports.default = router;
//# sourceMappingURL=TranslationRoutes.js.map