import { Document, Model } from "mongoose";
export interface OrderAttras{
    userId:string,
    orderData:{
        contactName:string,
        contactEmail:string,
        contactPhone:string,
        companyName:string,
        companyWebsite:string,
        adDescription:string,
        adImage:string,
        targetAudience:string,
        advertisPlan:string
    },
    totalPrice:number,
    createAt:Date,
    status:string,
    
}

export interface OrderDoc extends Document{
    userId:string,
    orderData:{
        contactName:string,
        contactEmail:string,
        contactPhone:string,
        companyName:string,
        companyWebsite:string,
        adDescription:string,
        adImage:string,
        targetAudience:string,
        advertisPlan:string
    },
    totalPrice:number,
    createAt:Date,
    status:string,
    
}
export interface OrderModel extends Model<OrderDoc>{
    build(attrs:OrderAttras):OrderDoc;
}