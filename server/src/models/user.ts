import {model,Model,Document,Schema} from 'mongoose';
import { UserAttrs, UserDoc, UserModel } from '../@types/UserAttras';
import { Password } from '../service/password';




const userSchema = new Schema({
  
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
   password:{
        type:String,
        required:true
    }
   
},{toJSON:{
    transform(doc,ret){
        ret.id=ret._id;
        delete ret._id;
        
        delete ret.__v
    }
}});


userSchema.pre('save',async function (done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password',hashed);
    }
    done()
})

userSchema.statics.build = (attrs:UserAttrs)=>{
    return new User(attrs)
}

const User = model<UserDoc,UserModel>('User',userSchema)
export { User };