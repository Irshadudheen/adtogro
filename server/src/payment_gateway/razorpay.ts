import Razorpay from 'razorpay'
const instance = new Razorpay({
    key_id:process.env.key_id,
    key_secret:process.env.key_secret
})
export {instance}