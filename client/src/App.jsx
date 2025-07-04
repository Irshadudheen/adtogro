import React,{Suspense, useEffect} from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import './lib/i18n'

const Coffee = lazyWithLoader(()=>import('@/pages/coffee/Coffee'))
const HomePage = lazyWithLoader(()=>import('@/pages/home/HomePage'))
const PricingPage = lazyWithLoader(()=>import('@/pages/PricingPage'))
const NotFoundPage = lazyWithLoader(()=>import('@/pages/404/404Page'))
const AdvertisePage = lazyWithLoader(()=>import('@/pages/AdvertisePage'))
const Talkspace = lazyWithLoader(()=>import('@/pages/Talkspace/talkspace'))


const TalkspaceRoom = lazyWithLoader(()=>import('@/pages/TalkSpaceRoom/TalkspaceRoom'))
const ForgotPassowrd = lazyWithLoader(()=>import('@/pages/forgot-password/forgotPassword'))
const AdvertiserDashboard = lazyWithLoader(()=>import( '@/pages/advetiseDashboard/advertiseDashboard'))

import EmailverifyPage from '@/pages/email/emailverifyPage'
import useGetUserData from '@/hooks/useGetUser'
import NewPasswordPage from '@/pages/forgot-password/newPassword'
import LoginPage from './pages/login/loginPage'
import Loader  from './components/loader'
import lazyWithLoader from './utils/lazyWithLoader'
import Offline from './utils/offline'
import LanguageWrapper from './components/LanguageWrapper'
import AnalyticsProvider from './context/analaticsState/providerAnalytics'
import Dashboard from './components/Dashboard'
const Privacy = lazyWithLoader(()=>import('./pages/Privacy'))
import { LiveCountProvider } from '@/context/LiveCountContext'
import { JoinRoomProvider } from '@/hooks/useJoinRoom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoginModalProvider } from './context/LoginModalContext'
import { RoomDetailsProvider } from './context/videoCallRoomContext/RoomDetailsContext'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { useTranslation } from 'react-i18next'
// import { AudioProvider } from '@/context/backgroundAudio/AudioContext'
const Termscondition = lazyWithLoader(()=>import('./pages/terms&condition'))


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
   
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
     <LiveCountProvider>
      <JoinRoomProvider>
      <LoginModalProvider >
        <Offline/>
      <Suspense fallback={<Loader />}>
      {isOnline&&<Routes>
        <Route path='/loader'               element={<Loader/>}/>
        <Route path='/coffee'               element={<Coffee/>}/>
        <Route path="/"                     element={<HomePage />} />
        <Route path='/dashboard'            element={<Dashboard/>}/>
        <Route path='/TalkSpace'            element={<Talkspace/>}/>
        <Route path='/privacy'              element={<Privacy/>}/>
        <Route path='/terms'                element={<Termscondition/>}/>
        <Route path="*"                     element={<NotFoundPage/>} />
        <Route path="/pricing"              element={<PricingPage />} />
        <Route path="/advertise"            element={<AdvertisePage />} />
      
        <Route path='/forgot-password'      element={<ForgotPassowrd/>} />
        <Route path='/reset-password/:token'element={<NewPasswordPage/>} />
        <Route path="/verify-email/:userId" element={<EmailverifyPage />} />
        <Route path="/login"                element={user.id?<Navigate to={'/'}/>:<LoginPage />} />
        <Route path="/:lang"                element={<LanguageWrapper><HomePage /></LanguageWrapper>} />
        <Route path='/talkspaceroom/:roomId'element={<RoomDetailsProvider><TalkspaceRoom/></RoomDetailsProvider>}/>
        <Route path='/advertiser-dashboard' element={user.id?<AnalyticsProvider><AdvertiserDashboard/></AnalyticsProvider>:<Navigate to={'/'}/> } />
      
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
