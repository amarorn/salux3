import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: {
          50: '#fafbff',
          100: '#f3f5fb',
          200: '#eef0f7',
        },
        /** Paleta próxima de templates corporativos (ex.: tema escuro + amarelo de destaque). */
        ppt: {
          ink: '#282a28',
          highlight: '#fffe00',
          gold: '#fec000',
        },
        accent: {
          violet: '#7c3aed',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.12)',
        floating:
          '0 1px 2px rgba(15,23,42,0.04), 0 20px 60px -20px rgba(15,23,42,0.18), 0 2px 6px rgba(15,23,42,0.04)',
        glow: '0 0 0 1px rgba(124,58,237,0.18), 0 20px 80px -20px rgba(124,58,237,0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'orbit-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'orbit-slow': 'orbit-slow 60s linear infinite',
        pulse: 'pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
