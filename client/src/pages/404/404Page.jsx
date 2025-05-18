import React, { useState } from 'react';
import './404style.css'
import { useNavigate } from 'react-router-dom';
function NotFoundPage() {

  const navigate = useNavigate()
const handleGoHome =()=>{
  console.log('dhd')
  try {
    navigate('/')
  } catch (error) {
    throw error 
  }
}
  

  return (
 <div className="w-full max-w-5xl mx-auto p-4">
  <div className="width: 100%; overflow-x: auto;">
    <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
      <circle cx="150" cy="440" r="100" fill="#E8EAF6" />
      <circle cx="650" cy="100" r="70" fill="#E8EAF6" />

      <path className="gear" d="M70,90 L80,70 L100,80 L110,60 L90,50 L100,30 L120,40 L140,30 L130,10 L150,10 L150,30 L170,30 L180,10 L200,20 L190,40 L210,50 L230,40 L240,60 L220,70 L230,90 L210,100 L220,120 L200,130 L190,110 L170,120 L170,140 L150,140 L140,120 L120,130 L100,120 L110,100 L90,90 L70,90" />
      
      <path className="gear2" d="M650,320 L660,300 L680,310 L690,290 L670,280 L680,260 L700,270 L720,260 L710,240 L730,240 L730,260 L750,260 L760,240 L780,250 L770,270 L790,280 L810,270 L820,290 L800,300 L810,320 L790,330 L800,350 L780,360 L770,340 L750,350 L750,370 L730,370 L720,350 L700,360 L680,350 L690,330 L670,320 L650,320" />
    
      <text className="error-shadow" x="403" y="200" textAnchor="middle" dx="5" dy="5" fontSize="60" fill="#B0BEC5">404</text>
      <text className="error-text" x="400" y="200" textAnchor="middle" fontSize="60" fill="#3F51B5">404</text>
      <text className="message-text" x="400" y="260" textAnchor="middle" fontSize="20" fill="#455A64">Oops! Page not found</text>

      <g className="robot">
        <rect x="350" y="300" width="100" height="120" rx="10" ry="10" fill="#90A4AE" />
        <rect x="360" y="320" width="80" height="60" rx="5" ry="5" fill="#78909C" />
        <circle cx="380" cy="350" r="10" className="robot-eye" fill="#fff" />
        <circle cx="420" cy="350" r="10" className="robot-eye" fill="#fff" />
        <rect x="385" y="380" width="30" height="5" rx="2" ry="2" fill="#455A64" />
        <rect x="340" y="360" width="10" height="30" fill="#90A4AE" />
        <rect x="450" y="360" width="10" height="30" fill="#90A4AE" />
        <rect x="370" y="420" width="20" height="30" fill="#90A4AE" />
        <rect x="410" y="420" width="20" height="30" fill="#90A4AE" />
        <circle cx="400" cy="290" r="15" fill="#90A4AE" />
        <rect x="395" y="275" width="10" height="15" fill="#90A4AE" />
      </g>

      <g className="broken-page">
        <path d="M600,350 L650,320 L680,350 L650,380 Z" fill="white" stroke="#B0BEC5" strokeWidth="2" />
        <path d="M600,350 L630,335 L630,365 Z" fill="white" stroke="#B0BEC5" strokeWidth="2" />
        <line x1="610" y1="340" x2="630" y2="340" stroke="#B0BEC5" strokeWidth="2" />
        <line x1="610" y1="350" x2="625" y2="350" stroke="#B0BEC5" strokeWidth="2" />
        <line x1="610" y1="360" x2="620" y2="360" stroke="#B0BEC5" strokeWidth="2" />
        <line x1="660" y1="335" x2="675" y2="335" stroke="#B0BEC5" strokeWidth="2" />
        <line x1="655" y1="345" x2="670" y2="345" stroke="#B0BEC5" strokeWidth="2" />
        <line x1="660" y1="355" x2="675" y2="355" stroke="#B0BEC5" strokeWidth="2" />
      </g>

      <g transform="translate(180, 320) rotate(-20)">
        <circle cx="0" cy="0" r="40" fill="white" stroke="#3F51B5" strokeWidth="8" />
        <line x1="30" y1="30" x2="80" y2="80" stroke="#3F51B5" strokeWidth="8" strokeLinecap="round" />
      </g>

      <path className="search-path" d="M100,450 Q200,480 300,450 T500,450 T700,450" stroke="#3F51B5" fill="none" />

      <rect className="button" x="350" y="450" width="100" height="40" fill="#3F51B5" rx="8" />
      <text className="button-text" onClick={handleGoHome} x="400" y="475" style={{ cursor: 'pointer', pointerEvents: 'auto' }} textAnchor="middle" fontSize="16" fill="white">GO HOME</text>
    </svg>
  </div>
</div>
  );
}

export default NotFoundPage;