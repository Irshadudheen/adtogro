import React from 'react'

function loader() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-white '>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1390 497" width="400" height="150">
  <g id="logo">
  
    <path d="M161,70C72,70,0,142,0,231s72,161,161,161V370C91,370,40,310,40,231S91,92,161,92V70Z" fill="#ffd900"/>
    <circle cx="161" cy="231" r="90" fill="white"/>
    <circle cx="161" cy="231" r="54" fill="#ffd900">
      <animate attributeName="r" values="54;60;54" dur="1.2s" repeatCount="indefinite"/>
    </circle>

   
    <g transform="translate(161, 231)">
      <g>
        <polygon points="0,-160 -25,-115 25,-115" fill="black">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360"
            dur="2s" repeatCount="indefinite" />
        </polygon>
      </g>
    </g>

  
    <g transform="translate(270, 250)">
      <text font-family="Arial, sans-serif" font-size="160" fill="black">dtogro</text>
    </g>
  </g>
</svg>
    </div>
  )
}

export default loader
