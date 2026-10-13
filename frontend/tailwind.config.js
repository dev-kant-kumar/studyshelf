import plugin from 'tailwindcss/plugin'
export default {
  theme: { extend: {
    fontFamily: { sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'], display: ['Literata', 'Georgia', 'serif'] },
    colors: {
      canvas: '#F6F8FC', surface: '#FFFFFF', soft: '#EDF2FA', ink: '#17243B', subtle: '#526078',
      brand: '#2457C5', 'brand-hover': '#1B439C', 'on-brand': '#FFFFFF', selected: '#E8EFFD',
      line: '#DCE3EF', outline: '#7B879A', accent: '#785500', 'accent-soft': '#FFF4CC', success: '#166534', danger: '#B42318',
      night: { canvas: '#101725', surface: '#162033', soft: '#1D2A41', ink: '#E6EDF8', subtle: '#ADBBD0', brand: '#93B4FF', 'brand-hover': '#B0C8FF', 'on-brand': '#10213F', selected: '#203458', line: '#33415A', outline: '#70809A', accent: '#F3D780', 'accent-soft': '#302A18', success: '#86EFAC', danger: '#FDA29B' },
    },
  } },
  plugins: [plugin(({ addVariant }) => addVariant('dark', '&:where([data-theme="dark"], [data-theme="dark"] *)'))],
}
