"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailResponseControllingError = exports.UserAuthControllingError = exports.DatabaseExitTraceRemaining = exports.SuccessManager = exports.DefaultRequestMethods = exports.VariantsType = exports.DatabaseTrace = exports.JSON_PACKETS = exports.ISO_Structures = exports.LanguageModules = exports.AuthTypeDeclared = exports.SchemaCreationType = void 0;
var RolesSpecified;
(function (RolesSpecified) {
    RolesSpecified["ADMIN_DESC"] = "admin";
    RolesSpecified["USER_DESC"] = "user";
    RolesSpecified["EMPTY"] = "Can't determine";
})(RolesSpecified || (RolesSpecified = {}));
var SchemaCreationType;
(function (SchemaCreationType) {
    SchemaCreationType["__WORKFLOWS"] = "workflow";
})(SchemaCreationType || (exports.SchemaCreationType = SchemaCreationType = {}));
var AuthTypeDeclared;
(function (AuthTypeDeclared) {
    AuthTypeDeclared["USER_REGISTRATION"] = "Register";
    AuthTypeDeclared["USER_LOGIN"] = "Login";
})(AuthTypeDeclared || (exports.AuthTypeDeclared = AuthTypeDeclared = {}));
exports.LanguageModules = {
    ISO_639_EIN: 'en',
    ISO_723_HIN: 'hi',
    ISO_812_FRN: 'fr'
};
exports.ISO_Structures = {
    ISO_639_EIN: 'ISO_639_EIN',
    ISO_723_HIN: 'ISO_723_HIN',
    ISO_812_FRN: 'ISO_812_FRN'
};
var JSON_PACKETS;
(function (JSON_PACKETS) {
    JSON_PACKETS["ISO_639_EIN"] = "ISO_639_EIN.json";
    JSON_PACKETS["ISO_723_HIN"] = "ISO_723_HIN.json";
    JSON_PACKETS["ISO_812_FRN"] = "ISO_812_FRN.json";
})(JSON_PACKETS || (exports.JSON_PACKETS = JSON_PACKETS = {}));
var DatabaseTrace;
(function (DatabaseTrace) {
    DatabaseTrace["SUCCESS_FETCHING"] = "Success";
    DatabaseTrace["ERROR_ENCOUNTERED"] = "Error";
    DatabaseTrace["DEFAULT_PARAMETER"] = "Default";
    DatabaseTrace["DatabaseConnectionTrace"] = "DatabaseConnectionTrace";
})(DatabaseTrace || (exports.DatabaseTrace = DatabaseTrace = {}));
var VariantsType;
(function (VariantsType) {
    VariantsType["TEXT"] = "text";
    VariantsType["OTP_TRACES"] = "otp";
})(VariantsType || (exports.VariantsType = VariantsType = {}));
var DefaultRequestMethods;
(function (DefaultRequestMethods) {
    DefaultRequestMethods["GET"] = "GET";
    DefaultRequestMethods["POST"] = "POST";
    DefaultRequestMethods["PUT"] = "PUT";
    DefaultRequestMethods["DELETE"] = "DELETE";
    DefaultRequestMethods["OPT"] = "OPTIONS";
    DefaultRequestMethods["PATCH"] = "PATCH";
})(DefaultRequestMethods || (exports.DefaultRequestMethods = DefaultRequestMethods = {}));
class SuccessManager {
    constructor(message_displayed) {
        this.message_displayed = 'DatabaseConnectionTrace';
    }
}
exports.SuccessManager = SuccessManager;
class DatabaseExitTraceRemaining extends Error {
    constructor(error_message) {
        super(error_message);
        this.name = `DatabaseConnection`;
    }
}
exports.DatabaseExitTraceRemaining = DatabaseExitTraceRemaining;
class UserAuthControllingError extends Error {
    constructor(error_message) {
        super(error_message);
        this.name = `UserNotExitsError`;
    }
}
exports.UserAuthControllingError = UserAuthControllingError;
class EmailResponseControllingError extends Error {
    constructor(error_message) {
        super(error_message);
        this.name = `EmailTracesNotSent`;
    }
}
exports.EmailResponseControllingError = EmailResponseControllingError;
exports.default = RolesSpecified;
//# sourceMappingURL=structure.js.map