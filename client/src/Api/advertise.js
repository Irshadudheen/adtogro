import Api from "../service/axios"
import { advertiseRoutes } from "../service/endPoint/advertiseEndPoint"

export const creatAdvertise = async (order_id)=>{
    try {
        const {data} = await Api.post(advertiseRoutes.createAdvertise,{order_id})
        return data
        
    } catch (error) {
        throw error
    }
}
export const fetchLogo = async ()=>{
    try {
        const {data} = await Api.get(advertiseRoutes.getLogo)
        return data.advertise
        
    } catch (error) {
        throw error
    }
}
export const countClick = async( id )=>{
    try {
        const {data} = await Api.patch(`${advertiseRoutes.updateClick}${id}`) 
        return {data}
    } catch (error) {
        throw error
    }
}
export const countImpression = async( id ) =>{
    try {
        const { data } = await Api.patch(`${advertiseRoutes.updateImpression}${id}`)
        return data
    } catch (error) {
        throw error
    }
}

export const renewAd = async (order_id,id)=>{
    try {
        const {data} =await Api.put(`${advertiseRoutes.renew}/${id}`,{order_id})
        
        return data
    } catch (error) {
        throw error
    }
}

export const updateAdvertise = async (editData,id)=>{
    try {
        const {data} = await Api.put(`${advertiseRoutes.update}/${id}`,editData)
        return data
    } catch (error) {
        throw error
        
    }
}