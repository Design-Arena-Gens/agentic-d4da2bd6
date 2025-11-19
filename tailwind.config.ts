import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#12182A',
        muted: '#9AA4B2',
        primary: {
          DEFAULT: '#6E7CFB',
          foreground: '#0B0F19'
        },
        accent: '#22D3EE'
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.12)'
      }
    },
  },
  plugins: [],
} satisfies Config
