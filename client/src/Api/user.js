
import axios from "axios";
import Api from "../service/axios";
import userRoutes from "../service/endPoint/userEndPoint";

export const signup =async (userPayload)=>{
    try {
       
     
        const {data} = await Api.post(userRoutes.signup,userPayload)
       
        return data
    } catch (error) {
        throw error
    }
}

export const login = async (loginData)=>{
    try {
        
        const {data} = await Api.post(userRoutes.login,loginData)
        
        
        return data
    } catch (error) {
    
        throw error
    }
}
export const forgotPassword = async(data)=>{
    try {
       
        const {data} = await Api.post(userRoutes.forgotPassword,data)
        return data
    } catch (error) {
        throw error
    }
}
export const userGoogleLogin = async (loginData)=>{
    try {
        
        const {data} = await Api.post(userRoutes.googleLogin,loginData)
        return data
    } catch (error) {
        throw error
    }
}
export const logout = async ()=>{
    try {
        const {data} = await Api.post(userRoutes.logout)
        return data
    } catch (error) {
        throw error
    }
}
export const verifyEmailApi = async (userId)=>{
    try {
        const {data} = await Api.post(`${userRoutes.verifyEmail}/${userId}`)
        return data
    } catch (error) {
        throw error
    }
}


 export const newPassword = async (token,password)=>{
    try {
        const {data} = await Api.patch(userRoutes.newPassword, {token, password})
        return data
    } catch (error) {
        throw error
    }
}

export const createRoom = async (roomData)=>{
    try {
        const {data} = await Api.post(userRoutes.createRoom, roomData)
        return data
    } catch (error) {
        throw error
    }
}
export const roomDetailsApi = async (roomId) =>{
    try {
        const {data} = await Api.get(`${userRoutes.roomDetails}/${roomId}`)
        return data
    } catch (error) {
        throw error 
    }
}
export const roomsDetails = async ({ page = 1, limit = 6, search = '' } = {}) =>{
    try {
        const {data}  = await Api.get(`${userRoutes.rooms}?page=${page}&&limit=${limit}&&search=${search}`)
        return data
    } catch (error) {
        
    }
}

export const commmunityCount = async ( )=>{
    try {
  const {data} = await Api.get(userRoutes.communityCount)
  return data      
    } catch (error) {
        throw error
    }
}
export const decodedToken = async (token)  =>{
    try {
        const {data} = await axios.get(import.meta.env.VITE_GOOGLE_API, {
            headers: {
                Authorization:'Bearer ' + token
            }}
        )
      const userData=  await userGoogleLogin(data)
       return userData
    } catch (error) {
        throw error 
    }
}
export const roomCount = async () =>{
    try {
        const {data}= await Api.get(userRoutes.roomCount)
        return data.roomCount
        
    } catch (error) {
        throw error
    }
}