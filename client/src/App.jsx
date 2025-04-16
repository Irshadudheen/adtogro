import React,{lazy,Suspense} from 'react'

const LoginPage =lazy(()=>import('./pages/login/loginPage'))
const HomePage =lazy(()=>import('./pages/home/HomePage'))
const PricingPage =lazy(()=>import('./pages/PricingPage'))
const AdvertisePage =lazy(()=>import('./pages/AdvertisePage'))


import { Route, Routes } from 'react-router-dom'
import BrickLoader from './components/brickLoader'



function App() {

  return (
    <div>
      <Suspense fallback={<BrickLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/advertise" element={<AdvertisePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      </Suspense>
    </div>
  )
}

export default App
