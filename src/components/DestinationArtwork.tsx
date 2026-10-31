import React from 'react';
import { DestinationDeal } from '../data/travelData';

interface DestinationArtworkProps {
  destination: DestinationDeal;
  className?: string;
}

export const DestinationArtwork: React.FC<DestinationArtworkProps> = ({ destination, className = '' }) => {
  const { primaryFrom, primaryTo, accentColor, landmarkType } = destination.svgTheme;

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        background: `linear-gradient(135deg, ${primaryFrom} 0%, ${primaryTo} 100%)`,
      }}
    >
      {/* Subtle architectural grid & topographic contours */}
      <svg
        viewBox="0 0 400 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        aria-label={destination.city}
      >
        <defs>
          <radialGradient id={`glow-${destination.id}`} cx="75%" cy="25%" r="60%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.42" />
            <stop offset="100%" stopColor={primaryFrom} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`horizon-${destination.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0" />
            <stop offset="65%" stopColor="#0f172a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.82" />
          </linearGradient>
        </defs>

        {/* Sun / Atmospheric Glow */}
        <rect width="400" height="260" fill={`url(#glow-${destination.id})`} />
        <circle cx="310" cy="68" r="42" fill={accentColor} fillOpacity="0.22" />
        <circle cx="310" cy="68" r="24" fill={accentColor} fillOpacity="0.45" />

        {/* Subtle latitude/longitude travel lines */}
        <path
          d="M -20 190 Q 140 135 420 175"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d="M 40 40 Q 200 15 350 90"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1.2"
          strokeDasharray="3 5"
        />

        {/* Landmark-specific vector illustration */}
        {landmarkType === 'cove' && (
          <g>
            {/* Mediterranean Cove & Cliffs */}
            <path d="M0 155 Q110 120 215 168 L215 260 L0 260 Z" fill="rgba(15, 23, 42, 0.35)" />
            <path d="M170 178 Q290 115 400 148 L400 260 L170 260 Z" fill="rgba(15, 23, 42, 0.52)" />
            <path d="M0 195 Q200 180 400 198 L400 260 L0 260 Z" fill="rgba(56, 189, 248, 0.25)" />
            {/* Sailboat silhouette */}
            <path d="M125 172 L134 146 L141 172 Z" fill="rgba(255,255,255,0.75)" />
            <path d="M121 174 L145 174 L141 178 L125 178 Z" fill="rgba(255,255,255,0.6)" />
          </g>
        )}

        {landmarkType === 'tram' && (
          <g>
            {/* Lisbon Hills & Archways */}
            <path d="M0 170 Q150 130 400 165 L400 260 L0 260 Z" fill="rgba(15, 23, 42, 0.38)" />
            {/* Bridge / Aqueduct arches */}
            <path
              d="M40 165 L40 125 L80 125 L80 165 M80 125 L120 125 L120 165 M120 125 L160 125 L160 165"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="3"
            />
            {/* Historic Tram Silhouette */}
            <rect x="210" y="132" width="64" height="32" rx="6" fill={accentColor} fillOpacity="0.82" />
            <rect x="218" y="138" width="12" height="11" rx="2" fill="#0f172a" fillOpacity="0.6" />
            <rect x="236" y="138" width="12" height="11" rx="2" fill="#0f172a" fillOpacity="0.6" />
            <rect x="254" y="138" width="12" height="11" rx="2" fill="#0f172a" fillOpacity="0.6" />
            <line x1="242" y1="132" x2="258" y2="112" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          </g>
        )}

        {landmarkType === 'parliament' && (
          <g>
            {/* Danube & Neo-Gothic Domes */}
            <rect x="0" y="182" width="400" height="78" fill="rgba(15, 23, 42, 0.5)" />
            <path d="M165 182 C165 135 235 135 235 182 Z" fill="rgba(255,255,255,0.25)" />
            <line x1="200" y1="112" x2="200" y2="145" stroke={accentColor} strokeWidth="2.5" />
            <rect x="110" y="154" width="180" height="28" fill="rgba(255,255,255,0.2)" />
            <path d="M130 154 L135 128 L140 154 Z M260 154 L265 128 L270 154 Z" fill="rgba(255,255,255,0.3)" />
            {/* Water reflections */}
            <line x1="150" y1="195" x2="250" y2="195" stroke={accentColor} strokeOpacity="0.4" strokeWidth="1.5" />
            <line x1="170" y1="204" x2="230" y2="204" stroke={accentColor} strokeOpacity="0.25" strokeWidth="1.5" />
          </g>
        )}

        {landmarkType === 'bosphorus' && (
          <g>
            {/* Domes & Minarets */}
            <path d="M0 185 L400 185 L400 260 L0 260 Z" fill="rgba(15, 23, 42, 0.48)" />
            <path d="M150 185 C150 135 230 135 230 185 Z" fill="rgba(255,255,255,0.24)" />
            <rect x="132" y="115" width="5" height="70" fill="rgba(255,255,255,0.32)" />
            <rect x="243" y="115" width="5" height="70" fill="rgba(255,255,255,0.32)" />
            <path d="M130 115 L134.5 100 L139 115 Z M241 115 L245.5 100 L250 115 Z" fill={accentColor} fillOpacity="0.7" />
          </g>
        )}

        {landmarkType === 'acropolis' && (
          <g>
            {/* Classical Pediment & Columns on Hill */}
            <path d="M40 195 L130 150 L290 150 L370 195 L400 260 L0 260 Z" fill="rgba(15, 23, 42, 0.42)" />
            <polygon points="150,122 210,98 270,122" fill="rgba(255,255,255,0.32)" />
            <rect x="158" y="124" width="8" height="26" fill="rgba(255,255,255,0.28)" />
            <rect x="180" y="124" width="8" height="26" fill="rgba(255,255,255,0.28)" />
            <rect x="202" y="124" width="8" height="26" fill="rgba(255,255,255,0.28)" />
            <rect x="224" y="124" width="8" height="26" fill="rgba(255,255,255,0.28)" />
            <rect x="246" y="124" width="8" height="26" fill="rgba(255,255,255,0.28)" />
          </g>
        )}

        {(landmarkType === 'porto_bridge' || landmarkType === 'tatra' || landmarkType === 'medina' || landmarkType === 'valletta' || landmarkType === 'canary_volcano') && (
          <g>
            {/* Mountain / Arch / Horizon Composition */}
            <path d="M0 175 L110 115 L210 165 L310 105 L400 160 L400 260 L0 260 Z" fill="rgba(15, 23, 42, 0.36)" />
            <path d="M60 185 Q200 110 340 185" stroke="rgba(255,255,255,0.32)" strokeWidth="3" fill="none" />
            <path d="M0 190 L400 190 L400 260 L0 260 Z" fill="rgba(15, 23, 42, 0.48)" />
          </g>
        )}

        {/* Measured contrast scrim for text legibility */}
        <rect width="400" height="260" fill={`url(#horizon-${destination.id})`} />
      </svg>

      {/* Clean unboxed editorial overlay at bottom of artwork */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between text-white">
        <div>
          <div className="text-xs font-medium text-white/80 tracking-wide">
            {destination.country} <span aria-hidden="true">·</span> {destination.regionTag} <span aria-hidden="true">·</span> {destination.avgTempMayOct}°C Ø
          </div>
          <h3 className="text-lg font-bold tracking-tight text-white leading-snug mt-0.5">
            {destination.city}
          </h3>
        </div>
        <div className="text-right shrink-0 ml-3">
          <span className="font-mono text-xs text-white/75 uppercase tracking-wider block">
            IATA {destination.iata}
          </span>
        </div>
      </div>
    </div>
  );
};
