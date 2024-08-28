import mongoose, { Document, Schema } from "mongoose";
import RolesSpecified from "../../Common/structure";


interface stored_user_detailed_schema extends mongoose.Document {
    registered_user_email: string;
    registered_user_password: string;
    registered_username: string;
    otp_for_verification: string;
    is_user_verified: boolean;
    authorities_provided_by_role : RolesSpecified;
    created_at: Date;
    updated_at: Date;
}

const user_detailed_description_schema = new Schema({
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
    authorities_provided_by_role :{
        type: String,
        enum : Object.values(RolesSpecified),
        default : RolesSpecified.USER_DESC
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

const user_detailed_description = mongoose.model<stored_user_detailed_schema>('Registration', user_detailed_description_schema);
export default user_detailed_description;
