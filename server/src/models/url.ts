import { Model, model, Schema,Document } from "mongoose";
import { UrlAttras, UrlDoc, UrlModel  } from "../@types/UrlAttras";

const urlSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    longUrl:{
        type:String,
        required:true
    },
    shortUrl:{
        type:String,
        unique:true,
        required:true
    },
    topic:{
        type:String,
        required:true,
        default:'general'
    },
    clicks:{
        type:Number,
        required:true
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

urlSchema.statics.build = (attrs:UrlAttras)=>{
return new Url(attrs);
}

const Url = model<UrlDoc,UrlModel>('Url',urlSchema);

export { Url };