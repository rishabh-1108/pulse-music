import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pulse: {
          50: '#f0f0ff', 100: '#e4e4ff', 200: '#c8c8ff', 300: '#a7a7ff',
          400: '#8080ff', 500: '#6c5ce7', 600: '#5a4bd1', 700: '#4a3db8',
          800: '#3d3399', 900: '#332d7a', 950: '#1e1a4a',
        },
        dark: {
          50: '#f8f8f8', 100: '#f0f0f0', 200: '#e4e4e7', 300: '#d4d4d8',
          400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46',
          800: '#27272a', 850: '#1e1e22', 900: '#18181b', 950: '#09090b',
        },
        accent: {
          green: '#00d2a0', pink: '#ff6b9d', orange: '#ff9f43',
          blue: '#48dbfb', red: '#ff4757',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'pulse-gradient': 'linear-gradient(135deg, #6c5ce7 0%, #a78bfa 50%, #ff6b9d 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        glow: '0 0 20px rgba(108, 92, 231, 0.3)',
        'glow-lg': '0 0 40px rgba(108, 92, 231, 0.4)',
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'music-wave': 'music-wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        gradient: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        'pulse-glow': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        'slide-up': { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        'slide-down': { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'music-wave': { '0%': { height: '4px' }, '50%': { height: '16px' }, '100%': { height: '4px' } },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
