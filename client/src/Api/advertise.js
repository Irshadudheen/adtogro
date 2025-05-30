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
        return response.data.advertise
        
    } catch (error) {
        throw error
    }
}
export const countClick = async( id )=>{
    try {
        const response = await Api.get(`${advertiseRoutes.updateClick}${id}`) 
        return response.data 
    } catch (error) {
        throw error
    }
}
export const countImpression = async( id ) =>{
    try {
        const { data } = await Api.post(`${advertiseRoutes.updateImpression}${id}`)
        return data
    } catch (error) {
        throw error
    }
}