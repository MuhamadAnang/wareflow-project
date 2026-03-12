# DVRP Simulation Application

The DVRP Simulation Application is a modern web-based platform designed to
simulate and optimize dynamic vehicle routing problems in real-time. This
application helps you visualize route planning, analyze performance metrics,
and explore routing optimization strategies with an intuitive user interface.

## Tech Stack

This project uses modern, production-ready technologies:

- **Next.js 16** with App Router
- **React 19** for building interactive user interfaces
- **TypeScript** for type-safe code
- **TailwindCSS 4** for responsive styling
- **shadcn/ui** for reusable UI components
- **TanStack Query** for server state management
- **Zod** for schema validation
- **Jest** for unit testing

## Prerequisites

Before you get started, ensure you have the following installed:

- **Node.js 22**: Use [NVM](https://github.com/nvm-sh/nvm) to manage Node.js
  versions across your projects.
- **pnpm**: This project uses pnpm for package management, which is enabled
  via corepack.
- **Docker** (optional): For containerized deployment.

## Getting Started

Follow these steps to set up the development environment and run the
application locally.

### Step 1: Install dependencies

Use pnpm to install all project dependencies:

```bash
pnpm install
```

### Step 2: Set up environment variables

Create a `.env.local` file in the project root and configure the required
environment variables. Refer to `.env.example` for the list of required
variables.

### Step 3: Start the development server

Run the development server:

```bash
pnpm dev
```

The application opens at `http://localhost:3000`. The page automatically
reloads as you make code changes.

## Project Structure

This project follows the Next.js App Router convention. The folder structure
organizes code by feature and function, making it easy to locate and maintain
specific functionality.

```
.
├── app
│   ├── (authenticated)      # Authenticated user routes
│   ├── (public)             # Public pages
│   ├── api                  # API routes
│   ├── _components          # Shared components
│   │   └── ui               # UI component library
│   └── _hooks               # Custom React hooks
├── common                   # Shared constants and configuration
├── drizzle                  # Database schema and migrations
├── lib                      # Utility functions and helpers
├── middleware               # Express middleware
├── public                   # Static assets
├── server                   # Server-side logic
├── services                 # External service integrations
├── tests                    # Test files and test utilities
└── types                    # TypeScript global type definitions
```

### Folder Descriptions

- **`app/`**: Main folder for Next.js App Router. Contains all pages,
  layouts, and route handlers.
- **`_components/`**: Reusable UI components built with shadcn/ui.
- **`_hooks/`**: Custom React hooks for common functionality.
- **`common/`**: Shared constants, configuration, and utility functions
  used across the application.
- **`drizzle/`**: Database schema definitions and migration files using
  Drizzle ORM.
- **`lib/`**: Library functions for common operations such as API calls,
  pagination, and query building.
- **`middleware/`**: Authentication and request middleware.
- **`public/`**: Static assets such as fonts and images.
- **`server/`**: Server-side controllers, repositories, and services.
- **`services/`**: Integrations with external services such as
  authentication providers.
- **`tests/`**: Unit and integration test files.
- **`types/`**: Global TypeScript type definitions and database types.

## Key Features

This application provides the following features:

- **Real-time simulation**: Simulate and visualize vehicle routing in real-time
  with dynamic updates.
- **Visual route mapping**: Interactive maps display routes, stops, and vehicle
  positions.
- **Performance analytics**: Analyze routing efficiency with metrics such as
  distance traveled and time spent.
- **Responsive design**: Works seamlessly across desktop and mobile devices
  using TailwindCSS.
- **Type-safe codebase**: Built with TypeScript and Zod for compile-time type
  safety and runtime validation.

## Available Scripts

The following scripts are available through pnpm:

- `pnpm dev`: Start the development server at `http://localhost:3000`.
- `pnpm build`: Build the application for production.
- `pnpm start`: Start the production server.
- `pnpm lint`: Run ESLint to check code quality.
- `pnpm test`: Run Jest tests.
- `pnpm format`: Format code using Prettier.

Run any script with `pnpm <script-name>`.

## Resources

For more information about the technologies used in this project, visit the
official documentation:

- [Next.js documentation](https://nextjs.org/docs): Learn about Next.js
  features, App Router, and best practices.
- [React documentation](https://react.dev): Understand React hooks, components,
  and patterns.
- [TailwindCSS documentation](https://tailwindcss.com/docs): Explore utility
  classes and styling techniques.
- [shadcn/ui documentation](https://ui.shadcn.com): Browse reusable UI
  components and implementation guides.
- [TanStack Query documentation](https://tanstack.com/query/latest): Manage
  server state and data synchronization.
- [Zod documentation](https://zod.dev): Learn about schema validation and type
  inference.
