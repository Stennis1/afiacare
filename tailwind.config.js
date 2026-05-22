export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        afia: {
          // Sea blue palette
          ocean: '#0077b6',
          sea: '#0096c7',
          sky: '#00b4d8',
          mist: '#90e0ef',
          foam: '#caf0f8',
          // Pink palette
          rose: '#e91e8c',
          pink: '#f06292',
          blush: '#f8bbd9',
          petal: '#fce4ec',
          // Neutrals
          navy: '#03045e',
          white: '#ffffff',
          light: '#f8fafc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'afia-gradient': 'linear-gradient(135deg, #03045e 0%, #0077b6 50%, #0096c7 100%)',
        'afia-hero': 'linear-gradient(135deg, #03045e 0%, #0077b6 60%, #e91e8c 100%)',
        'afia-card': 'linear-gradient(135deg, rgba(0,119,182,0.12) 0%, rgba(233,30,140,0.08) 100%)',
      },
      boxShadow: {
        'afia-blue': '0 4px 32px rgba(0, 119, 182, 0.25)',
        'afia-pink': '0 4px 32px rgba(233, 30, 140, 0.20)',
        'afia-card': '0 2px 16px rgba(3, 4, 94, 0.10)',
      },
    },
  },
  plugins: [],
};
