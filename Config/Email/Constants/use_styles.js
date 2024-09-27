"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_CONFIG_TEMPLATE = exports.useStyles = exports.email_content_rendering = exports.EMAIL_TAG_BINDING = void 0;
const styles_1 = require("@mui/styles");
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const Table_1 = __importDefault(require("@mui/material/Table"));
const TableBody_1 = __importDefault(require("@mui/material/TableBody"));
const TableCell_1 = __importDefault(require("@mui/material/TableCell"));
const TableContainer_1 = __importDefault(require("@mui/material/TableContainer"));
const TableRow_1 = __importDefault(require("@mui/material/TableRow"));
const structure_1 = require("../../../Common/structure");
const EmailTemplate_1 = __importDefault(require("../EmailTemplate"));
exports.EMAIL_TAG_BINDING = {
    _H: Typography_1.default,
    _P: Typography_1.default,
    _Bx: Box_1.default,
    _TC: TableCell_1.default,
    _TR: TableRow_1.default,
    _TB: TableBody_1.default,
    _T: TableContainer_1.default,
    _Tb: Table_1.default,
};
const email_content_rendering = (recievers_username, otp_for_verification, product_by_company) => [
    { text_context: structure_1.VariantsType.TEXT, content_rendering: `Hello ${recievers_username},` },
    { text_context: structure_1.VariantsType.OTP_TRACES, content_rendering: `Complete Registration` },
    { text_context: structure_1.VariantsType.TEXT, content_rendering: 'We have received a request to verify your email address. Please use the OTP code below to complete the verification process:' },
    { text_context: structure_1.VariantsType.OTP_TRACES, content_rendering: otp_for_verification },
    { text_context: structure_1.VariantsType.TEXT, content_rendering: 'If you did not request this, please ignore this email or contact support if you have any concerns.' },
    { text_context: structure_1.VariantsType.TEXT, content_rendering: `Thank you for choosing ${product_by_company}` },
];
exports.email_content_rendering = email_content_rendering;
exports.useStyles = (0, styles_1.makeStyles)((theme) => ({
    CONTAINER_REDESIGNED: {
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: '#fef4e5',
    },
    TABLE_WRAPPER: {
        maxWidth: '600px',
        margin: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        width: '100%',
    },
    HEADER_CONTAINER: {
        padding: '20px',
        backgroundColor: '#f7c300',
        color: '#ffffff',
        textAlign: 'center',
    },
    HEADER_TITLE: {
        margin: 0,
        fontSize: '24px',
    },
    BODY_PLANNED: {
        padding: '20px',
    },
    PARAGRAPH_TYPO: {
        fontSize: '16px',
        lineHeight: '1.5',
        color: '#333333',
    },
    OTP_REQUESTED: {
        color: '#f7c300',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '32px',
        margin: '10px 0',
    },
    FOOTER_CONTAINER: {
        padding: '20px',
        backgroundColor: '#fef4e5',
        textAlign: 'center',
    },
    FOOTER_TEXT: {
        fontSize: '14px',
        color: '#888888',
        margin: 0,
    },
}));
exports.EMAIL_CONFIG_TEMPLATE = EmailTemplate_1.default;
//# sourceMappingURL=use_styles.js.map