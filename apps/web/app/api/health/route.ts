import { db } from '@codex/db';
import { projects } from '@codex/db/schemas/projects.sql';

/**
 * This is a simple health check endpoint that checks if the database is connected
 * and that we can ping the server.
 * 
 */
export async function GET() {

  /**
   * Check if the database is connected.
   */
  try {
    await db.select().from(projects).limit(1);
  } catch (error) {
    return Response.json({ status: 'error', message: 'Database connection failed' }, { status: 500 });
  }

  return Response.json({ status: 'ok' }, { status: 200 });
}