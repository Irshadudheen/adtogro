import Api from "@/service/axios";
import { analyticsRoutes } from "@/service/endPoint/analyticsEndPoint";
import { data } from "react-router-dom";

export const fetchAnalytics = async () =>{
    try {
       const{data} = await Api.get(analyticsRoutes.getAnalytics);
        return data;
    } catch (error) {
        throw error
    }
}