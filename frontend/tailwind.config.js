module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6eef7',
          100: '#ccddef',
          200: '#99bbdf',
          300: '#6699cf',
          400: '#3377bf',
          500: '#0A2647',
          600: '#081e39',
          700: '#06172b',
          800: '#040f1c',
          900: '#02080e',
        },
        accent: {
          50: '#fff5eb',
          100: '#ffebd6',
          200: '#ffd7ad',
          300: '#ffc385',
          400: '#ffaf5c',
          500: '#FF9D42',
          600: '#cc7e35',
          700: '#995e28',
          800: '#663f1a',
          900: '#331f0d',
        },
        cream: {
          50: '#FFFDF5',
          100: '#FFF9E5',
          200: '#FFF2CC',
          300: '#FFEAB3',
          400: '#FFE299',
          500: '#FFDA80',
        },
        brand: {
          50: '#FFF5F5',
          100: '#FFE0E0',
          200: '#FFC7C7',
          300: '#FFA3A3',
          400: '#FF7A7A',
          500: '#FF5252',
          600: '#E63939',
          700: '#BF2C2C',
          800: '#991F1F',
          900: '#661515',
        },
        orange: {
          50: '#FFF8F1',
          100: '#FFEAD6',
          200: '#FFD5AD',
          300: '#FFBA80',
          400: '#FF9C52',
          500: '#FF7E24',
          600: '#E66A10',
          700: '#BF570D',
          800: '#99460A',
          900: '#663007',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};