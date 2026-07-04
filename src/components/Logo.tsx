import React from 'react'

type LogoProps = {
  inverted?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ inverted = false, size = 'md', className = '' }: LogoProps) {
  const id = `logo-${inverted ? 'inv' : 'def'}-${size}`
  const textColor = inverted ? '#ffffff' : '#111111'
  const subColor = inverted ? 'rgba(255,255,255,0.55)' : '#888888'
  const cubeSize = size === 'sm' ? 36 : size === 'lg' ? 56 : 46
  const titleClass = size === 'sm' ? 'text-[18px]' : size === 'lg' ? 'text-[28px]' : 'text-[22px]'
  const subClass = size === 'sm' ? 'text-[8px]' : size === 'lg' ? 'text-[11px]' : 'text-[9px]'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* ── 3-D isometric cube ── */}
      <svg
        width={cubeSize}
        height={cubeSize}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Top face — medium dark */}
          <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor={inverted ? '#555' : '#3a3a3a'} />
            <stop offset="100%" stopColor={inverted ? '#333' : '#1e1e1e'} />
          </linearGradient>
          {/* Left face — darker */}
          <linearGradient id={`${id}-left`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={inverted ? '#222' : '#111111'} />
            <stop offset="100%" stopColor={inverted ? '#2a2a2a' : '#1a1a1a'} />
          </linearGradient>
          {/* Right face — darkest */}
          <linearGradient id={`${id}-right`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={inverted ? '#1a1a1a' : '#0a0a0a'} />
            <stop offset="100%" stopColor={inverted ? '#111' : '#050505'} />
          </linearGradient>
          {/* Inner hollow top */}
          <linearGradient id={`${id}-inner`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor={inverted ? '#777' : '#505050'} />
            <stop offset="100%" stopColor={inverted ? '#555' : '#303030'} />
          </linearGradient>
        </defs>

        {/*
          Hex points (isometric cube):
          Top        = (40, 4)
          TopRight   = (72, 22)
          BotRight   = (72, 58)
          Bottom     = (40, 76)
          BotLeft    = (8,  58)
          TopLeft    = (8,  22)
          Center     = (40, 40)
        */}

        {/* ── Top face ── */}
        <polygon
          points="40,4 72,22 40,40 8,22"
          fill={`url(#${id}-top)`}
        />
        {/* ── Left face ── */}
        <polygon
          points="8,22 40,40 40,76 8,58"
          fill={`url(#${id}-left)`}
        />
        {/* ── Right face ── */}
        <polygon
          points="72,22 72,58 40,76 40,40"
          fill={`url(#${id}-right)`}
        />

        {/* ── Inner hollow on top face ── */}
        <polygon
          points="40,14 62,26 40,38 18,26"
          fill={`url(#${id}-inner)`}
          opacity="0.7"
        />

        {/* ── White separation lines ── */}
        {/* Outer edges */}
        <polyline points="40,4 72,22 72,58 40,76 8,58 8,22 40,4"
          stroke={inverted ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.7)'}
          strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
        {/* Center dividers */}
        <line x1="40" y1="4"  x2="40" y2="40" stroke={inverted ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.7)'} strokeWidth="1.5"/>
        <line x1="8"  y1="22" x2="40" y2="40" stroke={inverted ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.6)'} strokeWidth="1.2"/>
        <line x1="72" y1="22" x2="40" y2="40" stroke={inverted ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.6)'} strokeWidth="1.2"/>
        {/* Lower dividers */}
        <line x1="40" y1="40" x2="40" y2="76" stroke={inverted ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.5)'} strokeWidth="1.2"/>
        <line x1="8"  y1="58" x2="40" y2="40" stroke={inverted ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.4)'} strokeWidth="1"/>
        <line x1="72" y1="58" x2="40" y2="40" stroke={inverted ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.4)'} strokeWidth="1"/>

        {/* Inner hollow outline */}
        <polyline points="40,14 62,26 40,38 18,26 40,14"
          stroke={inverted ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.55)'}
          strokeWidth="1" fill="none"/>
      </svg>

      {/* ── Wordmark ── */}
      <div className="select-none leading-none">
        <div
          className={`font-black tracking-tight leading-none ${titleClass}`}
          style={{ color: textColor }}
        >
          PRESTOLET
        </div>
        <div
          className={`font-semibold tracking-[0.2em] uppercase mt-1 hidden sm:block ${subClass}`}
          style={{ color: subColor }}
        >
          Property Management
        </div>
      </div>
    </div>
  )
}
