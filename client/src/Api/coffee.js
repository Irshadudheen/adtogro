import Api from "../service/axios"
import { coffeeRoutes } from "../service/endPoint/coffeeEndPoinst"
import orderRoutes from "../service/endPoint/orderEndPoint"

export const orderCoffee=async(amount,message)=>{
try {
    const {data} = await Api.post(orderRoutes.orderCoffe,{amount,message})
    return data
} catch (error) {
    console.error(error)
    throw error
}
}
export const coffeeBuyed = async(coffeeId)=>{
    try {
        const { data} = await Api.post(`${coffeeRoutes.coffeeAccept}${coffeeId}`)
        return data
    } catch (error) {
        throw error
    }
}

export const getAllCoffee = async()=>{
    try {
        const {data} = await Api.get(coffeeRoutes.getAll)
        return data
    } catch (error) {
        throw error
    }
}