
import Api from "../service/axios";
import userRoutes from "../service/endPoint/userEndPoint";

export const signup =async (userPayload)=>{
    try {
        console.log(userPayload)
     
        const response = await Api.post(userRoutes.signup,userPayload)
        console.log(response.data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const login = async (loginData)=>{
    try {
        
        const response = await Api.post(userRoutes.login,loginData)
        console.log("after the login")
        
        return response.data
    } catch (error) {
    
        throw error
    }
}
export const forgotPassword = async(email)=>{
    try {
        
        const response = await Api.post(userRoutes.forgotPassword,{email})
        return response.data
    } catch (error) {
        throw error
    }
}
export const userGoogleLogin = async (loginData)=>{
    try {
        const response = await Api.post(userRoutes.googleLogin,loginData)
        return response.data
    } catch (error) {
        throw error
    }
}
export const logout = async ()=>{
    try {
        const response = await Api.post(userRoutes.logout)
        return response.data
    } catch (error) {
        throw error
    }
}



