import { model, Schema } from "mongoose";
import { OrderAttras, OrderDoc, OrderModel } from "../@types/OrderAttras";

const orderSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderData:{
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
        companyName:{
            type:String,
            required:true
        },
        companyWebsite:{
            type:String,
            required:true
        },
        adDescription:{
            type:String,
            required:true
        },
        adImage:{
            type:String,
            required:true
        },
        targetAudience:{
            type:String,
            required:true
        },
        advertisPlan:{
            type:String,
            required:true
        }

    },
    totalPrice:{
        type:Number,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    status:{
        type:String,
        enum:['pending','completed','failed'],
        default:'pending'
    },

},{toJSON:{transform(doc,ret){
    ret.id=ret._id;
    delete ret._id;
    delete ret.__v
}}})

orderSchema.statics.build = (attrs:OrderAttras)=>{
return new Order(attrs);
}

const Order = model<OrderDoc,OrderModel>('Order',orderSchema);

export { Order };