import Api from "../service/axios";
import orderRoutes from "../service/endPoint/orderEndPoint";

export const createOrder = async (orderData)=>{
    try {
        console.log('dfasjijfa')
        console.log('enter into creat Order',orderData,'the order data')
        console.log('ahsdifhasihfaifj')
    
        const response = await Api.post(orderRoutes.creatOrder, orderData)
        console.log(response,'the response from creat order')
        return response.data

    } catch (error) {
        throw error
    }
}
