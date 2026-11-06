/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        'secondary-bg': '#0A0A0F',
        card: '#111116',
        accent: {
          purple: '#A855F7',
          cyan: '#00E5FF',
        },
        border: '#25252D',
        secondary: '#A1A1AA',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-purple': '0 0 25px rgba(168, 85, 247, 0.35)',
        'neon-cyan': '0 0 25px rgba(0, 229, 255, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(0, 229, 255, 0.15) 100%)',
      },
    },
  },
  plugins: [],
}
