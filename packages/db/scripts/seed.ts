import { resolve } from 'path';
import { config } from 'dotenv';
import { eq, or } from 'drizzle-orm';

/**
 * As this will be run outside of the server, we need to load the env file.
 * IMPORTANT: This must be done before importing the db instance.
 */
config({ path: resolve(__dirname, '../../../.env') });

import { projects } from '../schemas/projects.sql';
import { folders } from '../schemas/folders.sql';
import { files } from '../schemas/files.sql';

/**
 * Generates a random file size between 10KB and 5MB.
 * @returns integer between 10KB and 5MB.
 */
const sizeBytes = () => Math.floor(Math.random() * (5_000_000 - 10_000 + 1)) + 10_000;


async function main() {
  console.log("🌱 Seeding Alpha…");

  /**
   * Because we want the db instance to have access to the right env variables,
   * we need to import it after the env file is loaded.
   */
  const { db } = await import('../index.js');

  await db.transaction(async (tx) => {
    /**
     * Remove any existing project with the name "Alpha" or "Beta". Children
     * cascade will delete all associated folders and files.
     * 
     * NOTE: We can run the seed script multiple times without issue.
     */
    await tx.delete(projects).where(or(eq(projects.name, "Project Alpha"), eq(projects.name, "Project Beta")));

    /**
     * Create a single project, project "Alpha".
     */
    const result = await tx
      .insert(projects)
      .values([
        { name: "Project Alpha", description: "Experimental workspace for managing documents in one place." },
        { name: "Project Beta", description: "A more stable iteration of the trial workspace for teams." },
      ])
      .returning({ id: projects.id });


    const alphaId = result[0]?.id;
    const betaId = result[1]?.id;
    if (!alphaId || !betaId) {
      throw new Error("Failed to create 'Project Alpha' or 'Project Beta' project");
    }

    /**
     * Create four top-level folders: Engineering, Docs, Financials, and Design.
     */
    const top = await tx
      .insert(folders)
      .values([
        { projectId: betaId, parentId: null, name: "Engineering" },
        { projectId: alphaId, parentId: null, name: "Docs" },
        { projectId: alphaId, parentId: null, name: "Financials" },
        { projectId: betaId, parentId: null, name: "Design" },
      ])
      .returning({ id: folders.id, name: folders.name });

    const idByName = Object.fromEntries(top.map((f) => [f.name, f.id]));

    /**
     * Create a nested folder under Engineering, called "Frontend".
     */
    const frontendResult = await tx
      .insert(folders)
      .values({
        projectId: betaId,
        parentId: idByName["Engineering"],
        name: "Frontend",
      })
      .returning({ id: folders.id });

    const frontendId = frontendResult[0]?.id;
    if (!frontendId) {
      throw new Error("Failed to create 'Frontend' folder");
    }

    /**
     * Create 10 files: 4 in root, 2 in Docs, 2 in Financials, 2 in Engineering/Frontend.
     */
    await tx.insert(files).values([
      /**
       * Root files.
       */
      {projectId: alphaId, folderId: null, name: "intro.pdf", kind: "pdf", sizeBytes: sizeBytes()},
      {projectId: alphaId, folderId: null, name: "roadmap.docx", kind: "docx", sizeBytes: sizeBytes()},
      {projectId: alphaId, folderId: null, name: "budget.xlsx", kind: "xlsx", sizeBytes: sizeBytes()},
      {projectId: alphaId, folderId: null, name: "pitch.pptx", kind: "pptx", sizeBytes: sizeBytes()},

      /**
       * Docs files.
       */
      {projectId: alphaId, folderId: idByName["Docs"] ?? null, name: "requirements.docx", kind: "docx", sizeBytes: sizeBytes()},
      {projectId: alphaId, folderId: idByName["Docs"] ?? null, name: "meeting-notes.doc", kind: "doc", sizeBytes: sizeBytes()},

      /**
       * Financials files.
       */
      {projectId: alphaId, folderId: idByName["Financials"] ?? null, name: "jan_budget.xlsx", kind: "xlsx", sizeBytes: sizeBytes()},
      {projectId: alphaId, folderId: idByName["Financials"] ?? null, name: "pnl.xlsx", kind: "xlsx", sizeBytes: sizeBytes()},

      /**
       * Engineering/Frontend files.
       */
      {projectId: betaId, folderId: frontendId, name: "ui-spec.pdf", kind: "pdf", sizeBytes: sizeBytes()},
      {projectId: betaId, folderId: frontendId, name: "components.xlsx", kind: "xlsx", sizeBytes: sizeBytes()},
    ]);
  });

  console.log("✅ Seeded: Project Alpha & Project Beta + 5 folders + 10 files.");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});