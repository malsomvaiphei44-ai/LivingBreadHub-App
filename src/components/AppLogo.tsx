import React from "react";

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = "w-10 h-10", size = 200 }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`select-none shrink-0 ${className}`}
      id="living-bread-hub-emblem"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Shadow filter to give the emblem depth */}
        <filter id="emblem-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3" />
        </filter>

        {/* Text path definition for Arch typography */}
        {/* Top curved path - clockwise from left to right */}
        <path
          id="logo-top-path"
          d="M 28,100 A 72,72 0 0,1 172,100"
          fill="none"
        />

        {/* Bottom curved path - clockwise from right to left so text is right-side-up */}
        <path
          id="logo-bottom-path"
          d="M 172,100 A 72,72 0 0,1 28,100"
          fill="none"
        />
        
        {/* Wood grain pattern or gradient overlay */}
        <linearGradient id="wood-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#704e38" />
          <stop offset="50%" stopColor="#5c4033" />
          <stop offset="100%" stopColor="#483227" />
        </linearGradient>

        <linearGradient id="page-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8e0d5" />
          <stop offset="10%" stopColor="#faf6ef" />
          <stop offset="90%" stopColor="#fffdfa" />
          <stop offset="100%" stopColor="#e8e0d5" />
        </linearGradient>

        <linearGradient id="wheat-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f4cb60" />
          <stop offset="100%" stopColor="#be8a13" />
        </linearGradient>
      </defs>

      {/* Main outer background ring - beautiful aged parchment/cream tone */}
      <circle
        cx="100"
        cy="100"
        r="96"
        fill="#f4efe6"
        stroke="#4a3b32"
        strokeWidth="2.5"
        filter="url(#emblem-shadow)"
      />

      {/* Dotted concentric design outer tracker */}
      <circle
        cx="100"
        cy="100"
        r="91"
        fill="none"
        stroke="#4a3b32"
        strokeWidth="1"
        strokeDasharray="3.5 2.5"
        opacity="0.85"
      />

      {/* Outer rope-like border circle */}
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="#4a3b32"
        strokeWidth="0.75"
      />

      {/* Text block inner boundary */}
      <circle
        cx="100"
        cy="100"
        r="75"
        fill="none"
        stroke="#4a3b32"
        strokeWidth="1.5"
      />

      {/* Center circle background - slightly brighter cream */}
      <circle
        cx="100"
        cy="100"
        r="70"
        fill="#faf6ef"
        stroke="#4a3b32"
        strokeWidth="1"
      />

      {/* Concentric inner trim rings */}
      <circle
        cx="100"
        cy="100"
        r="68"
        fill="none"
        stroke="#4a3b32"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* --- TYPOGRAPHY ARCS --- */}
      {/* Top arched text: "LIVINGBREADHUB" */}
      <text
        fill="#32251d"
        fontFamily="'Times New Roman', Georgia, serif"
        fontWeight="bold"
        fontSize="13px"
        letterSpacing="1.8"
      >
        <textPath href="#logo-top-path" startOffset="50%" textAnchor="middle">
          LIVINGBREADHUB
        </textPath>
      </text>

      {/* Bottom arched text: "FEEDING THE SOUL WITH HIS WORD" */}
      <text
        fill="#4a3b32"
        fontFamily="'Times New Roman', Georgia, serif"
        fontWeight="800"
        fontSize="7.5px"
        letterSpacing="0.9"
      >
        <textPath href="#logo-bottom-path" startOffset="50%" textAnchor="middle">
          FEEDING THE SOUL WITH HIS WORD
        </textPath>
      </text>


      {/* --- ILLUSTRATIONS --- */}

      {/* 1. Golden Sunburst Rays behind the cross */}
      <g stroke="#be8a13" strokeWidth="0.5" opacity="0.3" strokeDasharray="1 3">
        <line x1="100" y1="100" x2="100" y2="46" />
        <line x1="100" y1="100" x2="154" y2="100" />
        <line x1="100" y1="100" x2="46" y2="100" />
        <line x1="100" y1="100" x2="138" y2="62" />
        <line x1="100" y1="100" x2="62" y2="62" />
        <line x1="100" y1="100" x2="138" y2="138" />
        <line x1="100" y1="100" x2="62" y2="138" />
        
        <line x1="100" y1="100" x2="120" y2="50" />
        <line x1="100" y1="100" x2="80" y2="50" />
        <line x1="100" y1="100" x2="150" y2="80" />
        <line x1="100" y1="100" x2="50" y2="80" />
      </g>

      {/* 2. Side Ornaments: Left Ear of Wheat */}
      <g id="left-wheat">
        <path d="M 44,124 Q 30,102 38,72" fill="none" stroke="#6d513d" strokeWidth="1" opacity="0.75" />
        {/* Grains arrangements */}
        <ellipse cx="36" cy="74" rx="3" ry="1.5" transform="rotate(-30 36 74)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />
        <ellipse cx="41" cy="77" rx="3" ry="1.5" transform="rotate(20 41 77)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />
        
        <ellipse cx="34" cy="80" rx="3" ry="1.5" transform="rotate(-35 34 80)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />
        <ellipse cx="39" cy="83" rx="3" ry="1.5" transform="rotate(15 39 83)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />

        <ellipse cx="33" cy="87" rx="3" ry="1.5" transform="rotate(-30 33 87)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />
        <ellipse cx="38" cy="90" rx="3" ry="1.5" transform="rotate(15 38 90)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />

        <ellipse cx="32" cy="94" rx="3" ry="1.5" transform="rotate(-25 32 94)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />
        <ellipse cx="38" cy="97" rx="3" ry="1.5" transform="rotate(10 38 97)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />

        <ellipse cx="33" cy="101" rx="2.5" ry="1.2" transform="rotate(-20 33 101)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.4" />
        <ellipse cx="38" cy="103" rx="2.5" ry="1.2" transform="rotate(10 38 103)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.4" />
      </g>

      {/* 3. Side Ornaments: Right Ear of Wheat */}
      <g id="right-wheat">
        <path d="M 156,124 Q 170,102 162,72" fill="none" stroke="#6d513d" strokeWidth="1" opacity="0.75" />
        {/* Grains arrangements */}
        <ellipse cx="164" cy="74" rx="3" ry="1.5" transform="rotate(30 164 74)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />
        <ellipse cx="159" cy="77" rx="3" ry="1.5" transform="rotate(-20 159 77)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />
        
        <ellipse cx="166" cy="80" rx="3" ry="1.5" transform="rotate(35 166 80)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />
        <ellipse cx="161" cy="83" rx="3" ry="1.5" transform="rotate(-15 161 83)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />

        <ellipse cx="167" cy="87" rx="3" ry="1.5" transform="rotate(30 167 87)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />
        <ellipse cx="162" cy="90" rx="3" ry="1.5" transform="rotate(-15 162 90)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />

        <ellipse cx="168" cy="94" rx="3" ry="1.5" transform="rotate(25 168 94)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />
        <ellipse cx="162" cy="97" rx="3" ry="1.5" transform="rotate(-10 162 97)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.5" />

        <ellipse cx="167" cy="101" rx="2.5" ry="1.2" transform="rotate(20 167 101)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.4" />
        <ellipse cx="162" cy="103" rx="2.5" ry="1.2" transform="rotate(-10 162 103)" fill="url(#wheat-gold)" stroke="#4a3b32" strokeWidth="0.4" />
      </g>

      {/* 4. Grape cluster ornament illustrations (classic winery detail decoration) */}
      {/* Left side Grape Vine */}
      <g id="left-grapes" stroke="#32251d" strokeWidth="0.4">
        <path d="M 43,115 Q 40,123 45,127" fill="none" stroke="#2f4216" strokeWidth="0.8" />
        <circle cx="41" cy="122" r="2.5" fill="#58315a" />
        <circle cx="45" cy="122" r="2.5" fill="#693c6c" />
        <circle cx="43" cy="126" r="2.5" fill="#442146" />
        <circle cx="39" cy="125" r="2" fill="#58315a" />
        <circle cx="44" cy="130" r="1.8" fill="#311433" />
        <path d="M 37,118 C 36,115 33,116 35,121" fill="none" stroke="#2f4216" strokeWidth="0.5" />
      </g>

      {/* Right side Grape Vine */}
      <g id="right-grapes" stroke="#32251d" strokeWidth="0.4">
        <path d="M 157,115 Q 160,123 155,127" fill="none" stroke="#2f4216" strokeWidth="0.8" />
        <circle cx="159" cy="122" r="2.5" fill="#58315a" />
        <circle cx="155" cy="122" r="2.5" fill="#693c6c" />
        <circle cx="157" cy="126" r="2.5" fill="#442146" />
        <circle cx="161" cy="125" r="2" fill="#58315a" />
        <circle cx="156" cy="130" r="1.8" fill="#311433" />
        <path d="M 163,118 C 164,115 167,116 165,121" fill="none" stroke="#2f4216" strokeWidth="0.5" />
      </g>

      {/* 5. Central Wood Cross */}
      <g id="holy-cross" filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.25))">
        {/* Wooden Vertical Post */}
        <rect
          x="91.5"
          y="41"
          width="17"
          height="92"
          rx="1"
          fill="url(#wood-gradient)"
          stroke="#321e14"
          strokeWidth="1.25"
        />
        {/* Wooden Horizontal Beam */}
        <rect
          x="68"
          y="62"
          width="64"
          height="16"
          rx="1"
          fill="url(#wood-gradient)"
          stroke="#321e14"
          strokeWidth="1.25"
        />
        {/* Wood grain highlight lines */}
        <path d="M 94,44 L 94,125 M 106,44 L 106,125" stroke="#f4ede1" strokeWidth="0.5" opacity="0.15" />
        <path d="M 70,69 L 130,69" stroke="#f4ede1" strokeWidth="0.5" opacity="0.15" />
        <path d="M 97,44 L 97,125 M 103,44 L 103,125" stroke="#1c100a" strokeWidth="0.5" opacity="0.25" />

        {/* Rope/cord center binding wraps (Classic X structure) */}
        {/* Diagonal wrap 1 */}
        <path d="M 91.5,62 L 108.5,78" stroke="#eedcc5" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 92,62 L 108,78" stroke="#322015" strokeWidth="0.4" strokeLinecap="round" />
        {/* Diagonal wrap 2 */}
        <path d="M 108.5,62 L 91.5,78" stroke="#eedcc5" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 108,62 L 92,78" stroke="#322015" strokeWidth="0.4" strokeLinecap="round" />
      </g>

      {/* 6. Maroon Bookmark Ribbon (hangs down between bible pages) */}
      <path
        d="M 100,105 L 100,147 C 100,154 105,156 105,160 L 95,160 C 95,156 100,154 100,147"
        fill="#800c14"
        stroke="#4a3b32"
        strokeWidth="0.8"
        strokeLinecap="round"
        filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.25))"
      />

      {/* 7. Open Holy Bible Screen Layer */}
      <g id="open-holy-bible" filter="drop-shadow(0px 3px 4px rgba(0,0,0,0.35))">
        {/* Deep leather bible outer cover edge frame */}
        <path
          d="M 45,128 Q 100,136 155,128 L 151,133 Q 100,141 49,133 Z"
          fill="#311c12"
          stroke="#1b0e0a"
          strokeWidth="1.2"
        />

        {/* Multiple pages stack effect for realism */}
        <path
          d="M 47,125 Q 100,132 153,125 L 153,127 Q 100,134 47,127 Z"
          fill="#ded3c3"
          stroke="#4a3b32"
          strokeWidth="0.4"
        />
        <path
          d="M 48,123 Q 100,130 152,123 L 152,125 Q 100,132 48,125 Z"
          fill="#ebe3d7"
          stroke="#4a3b32"
          strokeWidth="0.4"
        />

        {/* Dynamic Curved Left Page */}
        <path
          d="M 49,122 Q 100,128 100,123 L 100,91 Q 100,97 49,91 Z"
          fill="url(#page-gradient)"
          stroke="#4a3b32"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Dynamic Curved Right Page */}
        <path
          d="M 100,123 Q 100,128 151,122 L 151,91 Q 100,97 100,91 Z"
          fill="url(#page-gradient)"
          stroke="#4a3b32"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Book spine middle gutter shadow line */}
        <line x1="100" y1="91.5" x2="100" y2="123" stroke="#4a3225" strokeWidth="0.75" opacity="0.8" />
        <line x1="100.5" y1="91.5" x2="100.5" y2="123" stroke="#fff" strokeWidth="0.5" opacity="0.4" />

        {/* Left page headings and verses text */}
        <text
          x="74.5"
          y="99"
          fontFamily="'Times New Roman', Georgia, serif"
          fontWeight="bold"
          fontSize="4.8px"
          textAnchor="middle"
          fill="#403328"
          letterSpacing="0.4"
        >
          JOHN 6:35
        </text>
        
        {/* Mock Hebrew / Greek / Latin text lines */}
        <path
          d="M 56,104 L 92,104 M 56,108 L 92,108 M 56,112 L 88,112 M 56,116 L 90,116 M 56,120 L 76,120"
          stroke="#5c4a3b"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Mini styled initial capital letter T indicator */}
        <rect x="56" y="103" width="4" height="4" fill="#800c14" opacity="0.8" rx="0.4" />
        <text x="58" y="106.5" fill="#faf6ef" fontSize="3.5" fontFamily="serif" fontWeight="bold" textAnchor="middle">T</text>

        {/* Right page headings and verses text */}
        <text
          x="125.5"
          y="99"
          fontFamily="'Times New Roman', Georgia, serif"
          fontWeight="bold"
          fontSize="4.8px"
          textAnchor="middle"
          fill="#403328"
          letterSpacing="0.4"
        >
          THE WORD OF LIFE
        </text>

        {/* Mock Scripture text lines on the right */}
        <path
          d="M 108,104 L 144,104 M 108,108 L 144,108 M 108,112 L 140,112 M 108,116 L 142,116 M 108,120 L 128,120"
          stroke="#5c4a3b"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>
    </svg>
  );
};
