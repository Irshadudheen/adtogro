

export default function AnimatedBorderBox({
  children,
  className = "",
  borderColor = "#1976ed",
  backgroundColor = "#292a2e",
  borderWidth = 5,
  borderRadius = 10,
  glowIntensity = 20,
  animationDuration = 4,
  maxWidth = 250,
  maxHeight = 200,
  showGlow = true,
}) {
  const containerStyle = {
    maxWidth: `${maxWidth}px`,
    maxHeight: `${maxHeight}px`,
    borderRadius: `${borderRadius}px`,
  }

  const beforeStyle = {
    backgroundImage: `conic-gradient(rgba(0,0,0,0), ${borderColor}, rgba(0,0,0,0) 25%)`,
    animationDuration: `${animationDuration}s`,
  }

  const afterStyle = {
    left: `${borderWidth}px`,
    top: `${borderWidth}px`,
    width: `calc(100% - ${borderWidth * 2}px)`,
    height: `calc(100% - ${borderWidth * 2}px)`,
    background: backgroundColor,
    borderRadius: `${borderRadius - 3}px`,
  }

  const glowStyle = {
    filter: `blur(${glowIntensity}px)`,
    borderRadius: `${borderRadius}px`,
  }

  return (
    <div className={`relative ${className}`} style={containerStyle}>
      {/* Glow effect */}
      {showGlow && (
        <div className="animated-border-glow absolute inset-0 h-full w-full overflow-hidden" style={glowStyle}>
          <div className="animated-border-before absolute" style={beforeStyle} />
        </div>
      )}

      {/* Main border */}
      <div className="animated-border-main absolute inset-0 h-full w-full overflow-hidden" style={containerStyle}>
        <div className="animated-border-before absolute" style={beforeStyle} />
        <div className="animated-border-after absolute z-10" style={afterStyle} />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full w-full p-4">{children}</div>

      <style jsx>{`
        .animated-border-before {
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
          animation: rotate ${animationDuration}s linear infinite;
        }

        .animated-border-after {
          content: '';
          position: absolute;
        }

        @keyframes rotate {
          100% {
            transform: translate(-50%, -50%) rotate(1turn);
          }
        }
      `}</style>
    </div>
  )
}