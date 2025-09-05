<img width="1246" height="555" alt="Screenshot 2025-09-05 at 12 10 42" src="https://github.com/user-attachments/assets/656f76a4-00f3-48bf-ae9c-943cbf886e2e" />

# Codex

A modern file management system built with Next.js, providing an intuitive web interface for organizing projects, folders, and files. Featuring a complete file explorer with grid and list views, upload functionality, and hierarchical folder organization.

## ✨ Features

- **🗂️ Complete File Management**: Upload, organize, and manage files with an intuitive file explorer
- **📁 Hierarchical Folders**: Create nested folder structures for better organization
- **🎨 Modern UI**: Built with shadcn/ui components and supports light/dark themes
- **🔍 Search & Navigation**: Breadcrumb navigation and search functionality
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices
- **🗄️ Flexible Database**: SQLite for local development, Turso for production

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- pnpm 10+

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd codex
pnpm install
```

2. **Set up environment variables** - Create `.env` file in the root:
```bash
# For local development (SQLite)
DATABASE_URL=file:../../sqlite/dev.db

# For production (Turso) - add these instead:
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
```

3. **Initialize the database**:
```bash
# Create the SQLite database file
mkdir -p sqlite
touch sqlite/dev.db

# Run database migrations and seed data
pnpm --filter @codex/db db:migrate
pnpm --filter @codex/db db:seed
```

4. **Start the development server**:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Project Structure

This is a Turborepo monorepo with the following packages:

```
codex/
├── apps/
│   └── web/                    # Next.js frontend application
├── packages/
│   ├── db/                     # Database layer with Drizzle ORM
│   ├── ui/                     # Shared UI components (shadcn/ui)
│   ├── eslint-config/          # Shared ESLint configurations
│   └── typescript-config/      # Shared TypeScript configurations
└── sqlite/                     # Local SQLite database files
```

## ⚙️ Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | Database connection URL | `file:./sqlite/dev.db` (local)<br/>`libsql://db.turso.io` (production) |
| `DATABASE_AUTH_TOKEN` | 🟡 | Database auth token for Turso | Only required for production Turso deployments |

## 📚 Documentation

- **🔧 API Backend**: See [`apps/web/app/api/README.md`](apps/web/app/api/README.md) for detailed API documentation
- **🗄️ Database**: See [`packages/db/README.md`](packages/db/README.md) for database setup and management
- **🎨 Frontend**: See [`apps/web/README.md`](apps/web/README.md) for frontend architecture and components

## 🏃‍♂️ Running with Turborepo

This project uses [Turborepo](https://turbo.build/) for efficient task orchestration across the monorepo:

### Development
```bash
pnpm dev          # Start all development servers
pnpm dev --filter web    # Start only the web app
```

### Building
```bash
pnpm build        # Build all packages and apps
pnpm build --filter @codex/db   # Build only the database package
```

### Database Operations
```bash
pnpm --filter @codex/db db:generate    # Generate migrations
pnpm --filter @codex/db db:migrate     # Apply migrations
pnpm --filter @codex/db db:seed        # Seed with sample data
pnpm --filter @codex/db db:studio      # Open Drizzle Studio
```

### Linting & Formatting
```bash
pnpm lint         # Lint all packages
pnpm format       # Format code with Prettier
```

## 🎯 Current Release - v0.1.0

**Complete file management system** with:
- File explorer with grid and list views
- Upload files functionality  
- Delete files and folders
- Create folders
- Search functionality
- File and folder components with metadata
- Breadcrumb navigation
- Sidebar with project navigation
- Theme toggle (dark/light mode)
- Projects interface and management
- Database integration with Drizzle ORM and SQLite
- RESTful API endpoints for all CRUD operations

## 🔮 Next Release - v0.2.0

**Enhanced Navigation & Productivity** (Coming Soon):
- Navigation history with forward/back buttons
- Toast notifications for user feedback
- Improved file upload with progress indicators
- Keyboard shortcuts for power users
- File preview functionality
- Drag and drop file organization
- CI/CD integration for automated migrations

## 📄 License

This project is licensed under the AGPL 3.0 License - see the [LICENSE](LICENSE) file for details.
