import { model, Schema } from "mongoose";

const coffeeSchema =new Schema({
    amount: {
        type: Number,
        required: true
    },
    message:{
        type:String,
        
    }
    ,
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    createAt:{
        type: Date,
        default: Date.now()
    },
    expireAt:{
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    status:{
        type:String,
        default: 'pending',
        enum:['pending','completed','failed']
    }
},{toJSON:{transform(doc,ret){
    ret.id=ret._id;
    delete ret._id;
    delete ret.__v
}}})
export const Coffee = model('Coffee',coffeeSchema);