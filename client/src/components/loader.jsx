import React from 'react'
import './loaderStyle.css'

function loader() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-white'>
      {/* Mobile: Show only logo */}
      <div className='block sm:hidden -mt-16'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 95.69" className='w-20 h-20'>
          <defs></defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <line className="cls-2" x1="50" y1="41.06" x2="50" y2="26.74"/>
              
              <path className="cls-3" d="M13,52.46A25,25,0,0,1,18.09,37l-6.9-3.07-4-1.79A35.83,35.83,0,0,0,1,52.46C1,72.79,16.67,88.18,37.39,88.21V77.1C23.36,77.06,13,66.49,13,52.46Zm4.11-30,1.63,3.66,3.13,7a24.62,24.62,0,0,1,15.57-5.34V16.7A37.54,37.54,0,0,0,17.06,22.49Z"/>
              
              <path d="M76.48,73.35a5.73,5.73,0,0,1-6.12-6.12V22.11H60V33.75A27.45,27.45,0,0,0,37.39,20.69l-1.11,0a30.1,30.1,0,0,0-17.59,5.48l3.13,7,1.38,3.1a22,22,0,0,1,15-5.63C50.68,30.63,60,40.11,60,52.71S50.68,74.79,38.2,74.79s-22-9.48-22-22.08a22.36,22.36,0,0,1,5-14.36L18.09,37l-6.9-3.07A33.5,33.5,0,0,0,5.68,52.71c0,18.24,13.08,32,30.6,32q.55,0,1.11,0A27.45,27.45,0,0,0,60.16,71.43c.72,7.68,5.76,11.87,14.28,11.87h3.24v-10Z"/>
              
              <circle className="cls-3 yellow-circle" cx="38.2" cy="52.71" r="13"/>
              
              <polygon points="21.45 36.9 11.6 15.45 0 27.05 21.45 36.9"/>
            </g>
          </g>
        </svg>
      </div>

      {/* Desktop: Show full logo with text */}
      <div className='hidden sm:block'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333.2 95.69" className='w-64 h-64'>
          <defs></defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <text className="cls-1" transform="translate(79.4 77.1)">dtogro</text>
              <line className="cls-2" x1="196.08" y1="41.06" x2="196.08" y2="26.74"/>
              
              <path className="cls-3" d="M13,52.46A25,25,0,0,1,18.09,37l-6.9-3.07-4-1.79A35.83,35.83,0,0,0,1,52.46C1,72.79,16.67,88.18,37.39,88.21V77.1C23.36,77.06,13,66.49,13,52.46Zm4.11-30,1.63,3.66,3.13,7a24.62,24.62,0,0,1,15.57-5.34V16.7A37.54,37.54,0,0,0,17.06,22.49Z"/>
              
              <path d="M76.48,73.35a5.73,5.73,0,0,1-6.12-6.12V22.11H60V33.75A27.45,27.45,0,0,0,37.39,20.69l-1.11,0a30.1,30.1,0,0,0-17.59,5.48l3.13,7,1.38,3.1a22,22,0,0,1,15-5.63C50.68,30.63,60,40.11,60,52.71S50.68,74.79,38.2,74.79s-22-9.48-22-22.08a22.36,22.36,0,0,1,5-14.36L18.09,37l-6.9-3.07A33.5,33.5,0,0,0,5.68,52.71c0,18.24,13.08,32,30.6,32q.55,0,1.11,0A27.45,27.45,0,0,0,60.16,71.43c.72,7.68,5.76,11.87,14.28,11.87h3.24v-10Z"/>
              
              <circle className="cls-3 yellow-circle" cx="38.2" cy="52.71" r="13"/>
              
              <polygon points="21.45 36.9 11.6 15.45 0 27.05 21.45 36.9"/>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default loader