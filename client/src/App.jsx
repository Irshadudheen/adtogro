import React,{lazy,Suspense, useEffect} from 'react'


const HomePage =lazyWithLoader(()=>import('@/pages/home/HomePage'))
const PricingPage =lazyWithLoader(()=>import('@/pages/PricingPage'))
const AdvertisePage =lazyWithLoader(()=>import('@/pages/AdvertisePage'))
const ForgotPassowrd =lazyWithLoader(()=>import('@/pages/forgot-password/forgotPassword'))
const Talkspace =lazyWithLoader(()=>import('@/pages/Talkspace/talkspace'))
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import BrickLoader from '@/components/brickLoader'
import EmailverifyPage from '@/pages/email/emailverifyPage'
const NotFoundPage =lazyWithLoader(()=>import('@/pages/404/404Page'))
import useGetUserData from '@/hooks/useGetUser'
import NewPasswordPage from '@/pages/forgot-password/newPassword'
import { LiveCountProvider } from '@/context/LiveCountContext'
import AdvertiserDashboard from '@/pages/advetiseDashboard/advertiseDashboard'
import './lib/i18n'
import { JoinRoomProvider } from '@/hooks/useJoinRoom'
const TalkspaceRoom = lazyWithLoader(()=>import('@/pages/TalkSpaceRoom/TalkspaceRoom'))
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoginModalProvider } from './context/LoginModalContext'
import LoginPage from './pages/login/loginPage'
import Loader  from './components/loader'
import { RoomDetailsProvider } from './context/videoCallRoomContext/RoomDetailsContext'
import lazyWithLoader from './utils/lazyWithLoader'
import Offline from './utils/offline'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { useTranslation } from 'react-i18next'
import LanguageWrapper from './components/LanguageWrapper'

function App() {
const user =useGetUserData()
 const isOnline = useOnlineStatus();
 const {i18n} = useTranslation()
 const {lang} = useParams()
  useEffect(() => {
    if (['en', 'fr'].includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  return (

    <>
    <GoogleOAuthProvider clientId='824445413802-j8ir94j160j0t28cvc06majqtu13s8u8.apps.googleusercontent.com'>
     <LiveCountProvider>
      <JoinRoomProvider>
      <LoginModalProvider >
        <Offline/>
      <Suspense fallback={<Loader />}>
      {isOnline&&<Routes>
        <Route path='/loader' element={<Loader/>}/>
         <Route path="/" element={<HomePage />} />
        <Route path="/:lang" element={<LanguageWrapper><HomePage /></LanguageWrapper>} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/advertise" element={<AdvertisePage />} />
        <Route path="/login" element={user.id?<Navigate to={'/'}/>:<LoginPage />} />
        <Route path="/verify-email/:userId" element={<EmailverifyPage />} />
        <Route path='/forgot-password' element={<ForgotPassowrd/>} />
        <Route path='/reset-password/:token' element={<NewPasswordPage/>} />
        <Route path='/advertiser-dashboard' element={user.id?<AdvertiserDashboard/>:<Navigate to={'/'}/> } />
        <Route path='/TalkSpace' element={<Talkspace/>}/>
        <Route path='/offline' element={<Offline/>}/>
        <Route path='/talkspaceroom/:roomId' element={<RoomDetailsProvider><TalkspaceRoom/></RoomDetailsProvider>}/>
        
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>}
      </Suspense>
      </LoginModalProvider>
      </JoinRoomProvider>
      </LiveCountProvider>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
