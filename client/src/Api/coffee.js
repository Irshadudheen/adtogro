import Api from "../service/axios"
import orderRoutes from "../service/endPoint/orderEndPoint"

export const orderCoffee=async(amount)=>{
try {
    const {data} = await Api.post(orderRoutes.orderCoffe,{amount})
    return data
} catch (error) {
    console.error(error)
}
}