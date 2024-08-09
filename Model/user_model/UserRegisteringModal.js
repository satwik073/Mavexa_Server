"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var user_detailed_description_schema = new mongoose_1.Schema({
    registered_user_email: {
        type: String,
        unique: true,
        required: true,
    },
    registered_user_password: {
        type: String,
        required: true,
    },
    registered_username: {
        type: String,
        required: true,
    },
    otp_for_verification: {
        type: String,
    },
    is_user_verified: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});
var user_detailed_description = mongoose_1.default.model('Registration', user_detailed_description_schema);
exports.default = user_detailed_description;
