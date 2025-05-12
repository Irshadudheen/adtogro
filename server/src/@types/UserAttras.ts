import { Model ,Document} from "mongoose";

export interface UserAttrs {
    email:string,

    profileImage:string,
    is_verified?:boolean,
    createdAt?:string,
    name:string
}
export interface UserDoc extends Document{
    email:string,

    profileImage:string,
    is_verified:boolean,
    createdAt:string,
    name:string
    
}
export interface UserModel extends Model<UserDoc>{
    build(attrs:UserAttrs):UserDoc;
}