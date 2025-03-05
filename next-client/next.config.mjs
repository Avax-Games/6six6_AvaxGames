/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add a rule for audio files
    config.module.rules.push({
      test: /\.(wav|mp3|ogg)$/i,
      type: 'asset/resource',
    });
    
    return config;
  },
};

export default nextConfig;
