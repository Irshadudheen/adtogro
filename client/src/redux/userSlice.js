import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    id: '',
    name: '',
    email: '',
   
    blocked:false,
    user:undefined,
    profileImage:'',
    is_advertiser:false,
    token:''

}
const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setRole:(state,action)=>{
            state.role=action.payload
        },
        removeRole:(state)=>{
            state.role=''
        },
        updateAdvertiserStatus:(state,action)=>{
            const {is_advertiser} = action.payload;
            state.is_advertiser = is_advertiser;
        }
        ,
        setUser:(state,action)=>{
            const {name,email,id,blocked,profileImage,token,is_advertiser}=action.payload;
            console.log(action.payload,'action paylaod')
           
            state.name=name
            state.email=email
            state.id=id
            state.blocked=blocked
            state.profileImage=profileImage
            state.token =token
            state.is_advertiser = is_advertiser


        },
      
        removeUser:(state)=>{
          
            state.email='';
            state.id="";
            state.name="";
            state.profileImage="";
            state.token='';
            state.is_advertiser = false;

        }

    }


})
export const {setRole,removeRole,removeUser, setUser,updateAdvertiserStatus} = userSlice.actions;
export default userSlice.reducer;