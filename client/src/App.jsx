import React,{lazy,Suspense} from 'react'


const HomePage =lazy(()=>import('@/pages/home/HomePage'))
const PricingPage =lazy(()=>import('@/pages/PricingPage'))
const AdvertisePage =lazy(()=>import('@/pages/AdvertisePage'))
const ForgotPassowrd =lazy(()=>import('@/pages/forgot-password/forgotPassword'))

import { Navigate, Route, Routes } from 'react-router-dom'
import BrickLoader from '@/components/brickLoader'
import EmailverifyPage from '@/pages/email/emailverifyPage'
import NotFoundPage from '@/pages/404/404Page'
import useGetUserData from '@/hooks/useGetUser'
import NewPasswordPage from '@/pages/forgot-password/newPassword'
import { LiveCountProvider } from '@/context/LiveCountContext'
import AdvertiserDashboard from '@/pages/advetiseDashboard/advertiseDashboard'
import Talkspace from '@/pages/Talkspace/talkspace'
import { JoinRoomProvider } from '@/hooks/useJoinRoom'
import TalkspaceRoom from '@/pages/TalkSpaceRoom/TalkspaceRoom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoginModalProvider } from './context/LoginModalContext'



function App() {
const user =useGetUserData()
  return (

    <>
    <GoogleOAuthProvider clientId='824445413802-j8ir94j160j0t28cvc06majqtu13s8u8.apps.googleusercontent.com'>
     <LiveCountProvider>
      <JoinRoomProvider>
      <LoginModalProvider >
      <Suspense fallback={<BrickLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/advertise" element={<AdvertisePage />} />
        {/* <Route path="/login" element={user.id?<Navigate to={'/'}/>:<LoginPage />} /> */}
        <Route path="/verify-email/:userId" element={<EmailverifyPage />} />
        <Route path='/forgot-password' element={<ForgotPassowrd/>} />
        <Route path='/reset-password/:token' element={<NewPasswordPage/>} />
        <Route path='/advertiser-dashboard' element={user.id?<AdvertiserDashboard/>:<Navigate to={'/'}/> } />
        <Route path='/TalkSpace' element={<Talkspace/>}/>
        <Route path='/talkspaceroom/:roomId' element={<TalkspaceRoom/>}/>
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
      </Suspense>
      </LoginModalProvider>
      </JoinRoomProvider>
      </LiveCountProvider>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
