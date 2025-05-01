import Api from "../service/axios"
import { advertiseRoutes } from "../service/endPoint/advertiseEndPoint"

export const creatAdvertise = async (order_id)=>{
    try {
        const response = await Api.post(advertiseRoutes.createAdvertise,{order_id})
        console.log(response,'the response from creat advertise')
        return response.data
        
    } catch (error) {
        throw error
    }
}
export const fetchLogo = async ()=>{
    try {
        const response = await Api.get(advertiseRoutes.getLogo)
        console.log(response,'the response from fetch logo')
        return response.data.advertise
        
    } catch (error) {
        throw error
    }
}
export const countClick = async( id)=>{
    try {
        const response = await Api.get(`${advertiseRoutes.updateClick}${id}`) 
        return response.data 
    } catch (error) {
        throw error
    }
}