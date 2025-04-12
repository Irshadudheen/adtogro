import {  model, Schema } from "mongoose";
import { AdvertiseAttras,AdvertiseDoc,AdvertiseModel } from "../@types/AdvertiseAttras";

const advertiseSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
     companyWebsite:{
        type:String,
        required:true
    },
    contactName:{
        type:String,
        required:true
    },
    contactEmail:{
        type:String,
        required:true
    },
    contactPhone:{
        type:String,
        required:true
    },
    adDescription:{
        type:String,
    },
    adImage:{
        type:String,
        required:true
    },
    targetAudience:{
        type:String,
 
    },
    advertisPlan:{
        type:String,
        required:true
    },
    clicks:{
        type:Number,
        required:true,
        default:0
    },
    createdAt:{
        type:Date,
        required:true
    }
},{toJSON:{transform(doc,ret){
    ret.id=ret._id;
    delete ret._id;
    delete ret.__v
}}})

advertiseSchema.statics.build = (attrs:AdvertiseAttras)=>{
return new Advertise(attrs);
}

const Advertise = model<AdvertiseDoc,AdvertiseModel>('advertise',advertiseSchema);

export { Advertise };