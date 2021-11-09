// Replace `nextjs-github-pages` with your Github repo project name.
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
},
  // Use the prefix in production and not development.
  assetPrefix: isProd ? '/lump-beta/' : '',
}