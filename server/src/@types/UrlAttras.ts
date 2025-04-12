import { Document, Model } from "mongoose";

export interface UrlAttras{
    userId:string,
    longUrl:string,
    shortUrl:string,
    topic:string,
    clicks:number,
    createdAt:Date,
}
export interface UrlDoc extends Document{
    userId:string,
    longUrl:string,
    shortUrl:string,
    topic:string,
    clicks:number,
    createdAt:Date,
}
export interface UrlModel extends Model<UrlDoc>{
    build(attrs:UrlAttras):UrlDoc;
}