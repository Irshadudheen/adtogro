import { useSelector } from "react-redux";
import {store} from '../redux/storage'
export const getData =()=>{
    const state = store.getState()

    return state.token;
}
 const useGetUserData = () => {
    return useSelector((state) => state)
}
export default useGetUserData