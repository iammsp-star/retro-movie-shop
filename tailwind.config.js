/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          dark: '#0a0a10',
          panel: 'rgba(15, 18, 30, 0.85)',
          neonPink: '#ff007f',
          neonCyan: '#00f3ff',
          neonYellow: '#ffea00',
          accent: '#7928ca',
          vhsBlack: '#121216',
        },
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 15px rgba(255, 0, 127, 0.6), 0 0 30px rgba(255, 0, 127, 0.3)',
        'neon-cyan': '0 0 15px rgba(0, 243, 255, 0.6), 0 0 30px rgba(0, 243, 255, 0.3)',
        'vhs': '0 10px 30px -5px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { opacity: '0.7', filter: 'brightness(1)' },
          '100%': { opacity: '1', filter: 'brightness(1.3)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
