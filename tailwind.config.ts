import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f7f2',
          100: '#d9ecdf',
          200: '#b3d9be',
          300: '#7fbd94',
          400: '#4d9e6a',
          500: '#2d834f',
          600: '#226840',
          700: '#1a5433',
          800: '#164529',
          900: '#103520',
        },
        cream: {
          50:  '#FEFCF8',
          100: '#FAF6EF',
          200: '#F2EAD9',
          300: '#E8DECA',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
