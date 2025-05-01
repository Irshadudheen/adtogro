import { useSelector } from "react-redux";
import {store} from '../redux/storage'
export const getData =()=>{
    const state = store.getState()

    return state.id;
}
 const useGetUserData = () => {
    return useSelector((state) => state)
}
export default useGetUserData