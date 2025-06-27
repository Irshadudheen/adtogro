import axios from 'axios'
import { store } from "@/redux/storage";
import  { getData } from '@/hooks/useGetUser';
const Api = axios.create({
    baseURL:'http://localhost:3000/api',
    headers:{
        "Content-Type": 'application/json',
        "credentials":true,
    
   }
})
Api.interceptors.request.use(
    (config) => {
        const token = getData();
        if (token) {
          config.headers["Authorization"] = token;
        }
      
   
        
       
        return config;
    },
    (error) => {
    
        return Promise.reject(error);
    }
)
Api.interceptors.response.use(
    response => {
      
        return response;
    },
    (error) => {
       
        if( error.status === 403) {
      
            store.dispatch(removeUser())
        }
        if (error.response) {
            const { data } = error.response;
            
        } else {
            console.error('Error', error.message);
        }
        return Promise.reject(error);
    },
);
export default Api;