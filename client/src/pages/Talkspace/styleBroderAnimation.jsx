import React from 'react'

function StyleBroderAnimation() {
  return (
     <style jsx>{`
        /* Glow Border Animation */
        .animated-border-box, .animated-border-box-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 0;
          border-radius: 12px;
        }

        .animated-border-box-glow {
          filter: blur(20px);
        }

        .animated-border-box:before, .animated-border-box-glow:before {
          content: '';
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(0deg);
          position: absolute;
          width: 99999px;
          height: 99999px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(rgba(0,0,0,0), #f0b207cdcd, rgba(0,0,0,0) 25%);
          animation: rotate 4s linear infinite;
        }

        .animated-border-box:after {
          content: '';
          position: absolute;
          z-index: -1;
          left: 3px;
          top: 3px;
          width: calc(100% - 6px);
          height: calc(100% - 6px);
          background: white;
          border-radius: 9px;
        }

        @keyframes rotate {
          100% {
            transform: translate(-50%, -50%) rotate(1turn);
          }
        }

        .premium-room-container {
          position: relative;
          z-index: 1;
        }
      `}</style>
  )
}

export default StyleBroderAnimation
