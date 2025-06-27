import { Schema,model } from "mongoose";

const reportSchema = new Schema({
    userId:{type:Schema.Types.ObjectId, required:true },
    reportId:{type:Schema.Types.ObjectId,required:true},
    message:{type:String, required:true}
},{toJSON:{transform(doc,ret){
    ret.id=ret._id;
    delete ret._id;
    delete ret.__v
}}})
export const ReportUser = model('UserReport',reportSchema)