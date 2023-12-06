/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  // reactStrictMode: true,
  i18n: {
    locales: ['bg'],
    defaultLocale: 'bg',
    localeDetection: false,
  },
};

module.exports = nextConfig;
