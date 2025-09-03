import nextEnv from '@next/env'
import path from 'path'
import { fileURLToPath } from 'url'


/**
 * If running locally, we need to load the env file. In production,
 * this is handled by Vercel.
 */

if (!process.env.VERCEL) {
  const { loadEnvConfig } = nextEnv;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const projectDir = path.join(__dirname, "..", "..");
  loadEnvConfig(projectDir)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
}

export default nextConfig
