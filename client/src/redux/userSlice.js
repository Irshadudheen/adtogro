import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    id: '',
    name: '',
    email: '',
    role: '',
    blocked:false,
    user:undefined,
    profileImage:''

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
        setUser:(state,action)=>{
            const {role,name,email,id,blocked,profileImage,token}=action.payload;
            console.log(action.payload,'action paylaod')
            state.role=role
            state.name=name
            state.email=email
            state.id=id
            state.blocked=blocked
            state.profileImage=profileImage
            state.token =token


        },
      
        removeUser:(state)=>{
            state.role = '';
            state.email='';
            state.id="";
            state.name="";
            state.profileImage="";
        }
    }


})
export const {setRole,removeRole,removeUser, setUser} = userSlice.actions;
export default userSlice.reducer;