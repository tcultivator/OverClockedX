import { hostname } from "os";

/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "files.edgestore.dev" },
      { hostname: "res.cloudinary.com" },
      { hostname: "https://b.tile.openstreetmap.org" }
    ],
  },
  allowedDevOrigins: [
    'https://eruptional-deposable-alejandro.ngrok-free.dev',
  ],
};
