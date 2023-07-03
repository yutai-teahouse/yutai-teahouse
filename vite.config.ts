import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
  build: {
        target: 'es2020',
    },
  css: {
      postcss: {
          plugins: [
              tailwindcss,
              autoprefixer,
            ],
      }
    }
}