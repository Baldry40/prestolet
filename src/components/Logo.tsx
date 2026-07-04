import React from 'react'

type LogoProps = {
  inverted?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ inverted = false, size = 'md', className = '' }: LogoProps) {
  const fill = inverted ? '#ffffff' : '#111111'
  const lineFill = inverted ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.55)'
  const subtleLineFill = inverted ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'
  const cubeSize = size === 'sm' ? 34 : size === 'lg' ? 54 : 44
  const titleSize = size === 'sm' ? 'text-[17px]' : size === 'lg' ? 'text-2xl' : 'text-[21px]'
  const subSize = size === 'sm' ? 'text-[7px]' : 'text-[8.5px]'
  const titleColor = inverted ? 'text-white' : 'text-gray-950'
  const subColor = inverted ? 'text-white/50' : 'text-gray-400'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* ── Cube icon ── */}
      <svg
        width={cubeSize}
        height={cubeSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer hexagon body */}
        <polygon
          points="50,4 89,26 89,74 50,96 11,74 11,26"
          fill={fill}
        />

        {/* Top face tint */}
        <polygon
          points="50,4 89,26 50,50 11,26"
          fill={inverted ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.18)'}
        />
        {/* Left face tint */}
        <polygon
          points="11,26 50,50 50,96 11,74"
          fill={inverted ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.22)'}
        />

        {/* Primary structural lines */}
        <line x1="50" y1="4"  x2="50" y2="96" stroke={lineFill} strokeWidth="3"   strokeLinecap="round"/>
        <line x1="11" y1="26" x2="89" y2="74" stroke={lineFill} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="89" y1="26" x2="11" y2="74" stroke={lineFill} strokeWidth="2.5" strokeLinecap="round"/>

        {/* Left-face internal geometry */}
        <line x1="11" y1="50" x2="50" y2="27" stroke={subtleLineFill} strokeWidth="1.8"/>
        <line x1="11" y1="50" x2="50" y2="73" stroke={subtleLineFill} strokeWidth="1.8"/>
        <line x1="30" y1="38" x2="30" y2="85" stroke={subtleLineFill} strokeWidth="1.4"/>

        {/* Right-face internal geometry */}
        <line x1="89" y1="50" x2="50" y2="27" stroke={subtleLineFill} strokeWidth="1.8"/>
        <line x1="89" y1="50" x2="50" y2="73" stroke={subtleLineFill} strokeWidth="1.8"/>
        <line x1="70" y1="38" x2="70" y2="85" stroke={subtleLineFill} strokeWidth="1.4"/>

        {/* Top-face internal geometry */}
        <line x1="30" y1="38" x2="70" y2="15" stroke={subtleLineFill} strokeWidth="1.4"/>
        <line x1="70" y1="38" x2="30" y2="15" stroke={subtleLineFill} strokeWidth="1.4"/>
      </svg>

      {/* ── Wordmark ── */}
      <div className="select-none">
        <div className={`font-black tracking-tight leading-none ${titleSize} ${titleColor}`}>
          PRESTOLET
        </div>
        <div className={`font-semibold tracking-[0.18em] uppercase leading-none mt-1 hidden sm:block ${subSize} ${subColor}`}>
          Property Management
        </div>
      </div>
    </div>
  )
}
