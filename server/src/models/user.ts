import {model,Model,Document,Schema} from 'mongoose';
import { UserAttrs, UserDoc, UserModel } from '../@types/UserAttras';





const userSchema = new Schema({
    createdAt:{
        type:Date,
        default:Date.now()
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
   profileImage:{
    type:String,
    required:true
   }
  ,
    
    is_premium:{
        type:Boolean,
        default:false
    }   
   
   
},{toJSON:{
    transform(doc,ret){
        ret.id=ret._id;
        delete ret._id;
        
        delete ret.__v
    }
}});



userSchema.statics.build = (attrs:UserAttrs)=>{
    return new User(attrs)
}

const User = model<UserDoc,UserModel>('User',userSchema)
export { User };