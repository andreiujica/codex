# Codex Database Package

Database layer for the Codex project using Drizzle ORM with SQLite/libSQL support for both local development and Turso production deployments.

## 📁 Structure

```
db/
├── schemas/                       
│   ├── projects.sql.ts            # Projects table
│   ├── folders.sql.ts             # Folders table (hierarchical)
│   └── files.sql.ts               # Files table with metadata
├── drizzle/                       # Generated migrations
├── scripts/
│   └── seed.ts                    # Database seeding script
├── drizzle.config.ts              # Drizzle configuration
└── index.ts                       # Database client export
```

## 🗄️ Database Setup

NOTE: The migration commands need to be run manually for now, no CI/CD integration yet.

### Local Development (SQLite)

1. **Set environment variables** in your `.env` file:
```bash
DATABASE_URL=file:../../sqlite/dev.db
# DATABASE_AUTH_TOKEN not needed for local SQLite
```

2. **Create the actual database file** in the `sqlite/` folder:
```bash
cd ../.. 
touch sqlite/dev.db
```

2. **Generate and run migrations**:

```bash
pnpm db:generate    # Generate migration files
pnpm db:migrate     # Apply migrations to database
```

3. **Seed the database**:
```bash
pnpm db:seed        # Creates sample projects, folders, and files
```

### Production (Turso)

1. **Set environment variables** for Turso:
```bash
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
```

2. **Run migrations on Turso**:
```bash
pnpm db:migrate     # Applies migrations to remote Turso database
```

## 🛠️ Available Scripts

```bash
pnpm db:generate    # Generate migration files from schema changes
pnpm db:migrate     # Apply pending migrations to database
pnpm db:studio      # Open Drizzle Studio (database GUI)
pnpm db:seed        # Populate database with sample data
```


The database client automatically handles both local SQLite and remote Turso connections based on your environment variables.
