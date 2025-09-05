import { ZodSchema, ZodError } from "zod";
import { HttpError } from "./http";

/**
 * Validates the request body against the given schema.
 * @param req - The user-submitted request object.
 * @param schema - Zod schema to validate the request body against.
 * @returns The validated request body on success or a HttpError on failure.
 */
export async function validateRequestBody<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  try {
    const json = await req.json();
    return schema.parse(json);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new HttpError(400, "Invalid request body", err.flatten());
    }
    throw new HttpError(400, "Invalid JSON body");
  }
}

/**
 * Returns a JSON response with the given data and status code.
 * @param data - The data to be returned in the response.
 * @param init - The response init object.
 * @returns The response object. This is a wrapper around the Response object.
 */
export function json<T>(data: T, init?: ResponseInit) {
  return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" }, ...init });
}

/**
 * Returns a JSON response with the given error data and status code.
 * @param status - The status code.
 * @param message - The error message.
 * @param details - The error details.
 * @returns The response object.
 */
export function fail(status: number, message: string, details?: unknown) {
  return json({ error: { message, details } }, { status });
}

/**
 * A context type for the request object so that
 * we can await the params object.
 * 
 * Read more: https://nextjs.org/docs/messages/sync-dynamic-apis
 */
export type Ctx<T> = { params: Promise<T> };