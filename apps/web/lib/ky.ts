import ky from "ky"
/**
 * Configured ky instance for making API requests.
 */
export const api = ky.create({
  prefixUrl: "/api",
}) 