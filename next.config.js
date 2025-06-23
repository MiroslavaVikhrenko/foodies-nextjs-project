/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [ // allows this specific S3 URL as a valid source for images.
      {
        protocol: 'https',
        hostname: 'mirvikh-nextjs-demo-users-image.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig
