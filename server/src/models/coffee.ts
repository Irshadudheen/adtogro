import { model, Schema } from "mongoose";

const coffeeSchema =new Schema({
    amount: {
        type: Number,
        required: true
    },
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
    }
})
export const Coffee = model('Coffee',coffeeSchema);