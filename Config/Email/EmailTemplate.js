"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const use_styles_1 = require("./Constants/use_styles");
const structure_1 = require("../../Common/structure");
const PC_COMPANY = process.env.REACT_APP_PRODUCT_NAME || '';
const RC_USER = process.env.REACT_APP_RC_USERNAME || '';
const NOT = process.env.REACT_DEF_OTP_CANT_VERIFIED || '';
const EmailTemplate = ({ receivers_username, product_by_company, otp_for_verification }) => {
    const classes = (0, use_styles_1.useStyles)();
    const rendered_content_email = (0, use_styles_1.email_content_rendering)(receivers_username, otp_for_verification, product_by_company).map((item) => {
        const email_content = (item.content_rendering || '')
            .replace('{receivers_username}', receivers_username || RC_USER)
            .replace('{otp_for_verification}', otp_for_verification || NOT)
            .replace('{product_by_company}', product_by_company || PC_COMPANY);
        return (react_1.default.createElement(Typography_1.default, { key: email_content, className: item.text_context === structure_1.VariantsType.OTP_TRACES ? classes.OTP_REQUESTED : classes.PARAGRAPH_TYPO, variant: item.text_context === structure_1.VariantsType.OTP_TRACES ? 'h1' : 'body1' }, email_content));
    });
    return (react_1.default.createElement(use_styles_1.EMAIL_TAG_BINDING._Bx, { component: "header", className: classes.CONTAINER_REDESIGNED },
        react_1.default.createElement(use_styles_1.EMAIL_TAG_BINDING._T, { className: classes.TABLE_WRAPPER },
            react_1.default.createElement(use_styles_1.EMAIL_TAG_BINDING._Tb, null,
                react_1.default.createElement(use_styles_1.EMAIL_TAG_BINDING._TB, null,
                    react_1.default.createElement(use_styles_1.EMAIL_TAG_BINDING._TR, null,
                        react_1.default.createElement(use_styles_1.EMAIL_TAG_BINDING._TC, { className: classes.BODY_PLANNED }, rendered_content_email)),
                    react_1.default.createElement(use_styles_1.EMAIL_TAG_BINDING._TR, null,
                        react_1.default.createElement(use_styles_1.EMAIL_TAG_BINDING._TC, { className: classes.FOOTER_CONTAINER },
                            react_1.default.createElement(use_styles_1.EMAIL_TAG_BINDING._P, { className: classes.FOOTER_TEXT },
                                "\u00A9 ",
                                new Date().getFullYear(),
                                " ",
                                product_by_company,
                                ". All rights reserved."))))))));
};
exports.default = EmailTemplate;
//# sourceMappingURL=EmailTemplate.js.map