import Api from "../service/axios"

export const uploadImage = async(formData)=>{
try {
    const {data} = await Api.post('/upload-image',formData,{
        headers:{
        "Content-Type":'multipart/form-data'
    }})
    return data
} catch (error) {
    
}
}