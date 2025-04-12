import React from 'react'
import HomePage from './pages/home/HomePage'
import PricingPage from './pages/PricingPage'
import AdvertisePage from './pages/AdvertisePage'
import AdSpot from './components/AdSpot'
import AdBanner from './components/AdBanner'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/advertise" element={<AdvertisePage />} />
        <Route path="/adbanner" element={<AdBanner />} />
      </Routes>
    </div>
  )
}

export default App
