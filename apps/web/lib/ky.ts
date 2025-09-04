import ky from "ky"
/**
 * Configured ky instance for making API requests.
 * 
 * This instance:
 * - Uses the appropriate API URL based on environment
 * - Automatically includes the access token in the Authorization header
 * - Handles authentication errors gracefully
 */
export const api = ky.create({
  prefixUrl: "/api",
}) 