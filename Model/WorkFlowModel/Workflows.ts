import mongoose , { Schema} from "mongoose"


interface workflows_estaiblished extends mongoose.Document{
    accountOwnerId:mongoose.Schema.Types.ObjectId;
    displayName: string;
    descriptionConfig : string;
    isWorkflowEnabled : boolean;
    isWorkflowAllowed : boolean;

}

const schemaConfigs = new Schema({

    accountOwnerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration',
    },
    displayName:{
        type:String,
        required:true
    },
    descriptionConfig:{
        type:String,
        required:true
    },
    isWorkflowEnabled:{
        type:Boolean,
        default: true
    },
    isWorkflowAllowed:{
        type:Boolean,
        default: true
    }
})

const workFlowsSetting = mongoose.model<workflows_estaiblished>('Workflows', schemaConfigs);
export default workFlowsSetting