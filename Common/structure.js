"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailResponseControllingError = exports.UserAuthControllingError = exports.DatabaseExitTraceRemaining = exports.SuccessManager = exports.VariantsType = exports.DatabaseTrace = exports.AuthTypeDeclared = void 0;
var RolesSpecified;
(function (RolesSpecified) {
    RolesSpecified["ADMIN_DESC"] = "admin";
    RolesSpecified["USER_DESC"] = "user";
    RolesSpecified["EMPTY"] = "Can't determine";
})(RolesSpecified || (RolesSpecified = {}));
var AuthTypeDeclared;
(function (AuthTypeDeclared) {
    AuthTypeDeclared["USER_REGISTRATION"] = "Register";
    AuthTypeDeclared["USER_LOGIN"] = "Login";
})(AuthTypeDeclared || (exports.AuthTypeDeclared = AuthTypeDeclared = {}));
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