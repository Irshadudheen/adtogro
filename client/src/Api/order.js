import Api from "../service/axios";
import orderRoutes from "../service/endPoint/orderEndPoint";

export const createOrder = async (orderData)=>{
    try {
      
    
        const response = await Api.post(orderRoutes.creatOrder, orderData)
        
        return response.data

    } catch (error) {
        throw error
    }
}

export const renewOrderCreate = async (plan, advertiseId)=>{
    try {
      const  {data} = await Api.post(`${orderRoutes.renewOrder}/${advertiseId}`,{advertisPlan:plan})
      return data
    } catch (error) {
        throw error
    }
}