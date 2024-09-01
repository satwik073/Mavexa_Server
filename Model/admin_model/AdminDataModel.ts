import  mongoose, { Document , Schema } from "mongoose"
import RolesSpecified from "../../Common/structure"
interface AdminDataControllingInterface extends mongoose.Document{
    admin_userName : string,
    admin_userEmail : string,
    admin_userPassword : string,
    authorities_provided_by_role : RolesSpecified,

}
const admin_account_setup_schema = new Schema({
    admin_userName :{
        type: String,
        default : RolesSpecified.ADMIN_DESC
    },
    admin_userEmail :{
        type : String,
        required: true,
        unique: true,
    },
    admin_userPassword : {
        type : String,
        required: true,
    },
    authorities_provided_by_role :{
        type: String,
        enum : Object.values(RolesSpecified),
        default : RolesSpecified.ADMIN_DESC
    },
})

const admin_detailed_structure_description = mongoose.model<AdminDataControllingInterface>('Admin', admin_account_setup_schema)
export default admin_detailed_structure_description