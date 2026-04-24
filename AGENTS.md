# AGENTS.md

This file provides instructions for AI agents working on this project.

## Project Overview

AI Todo List is a Node.js/Express REST API following SOLID principles and CQRS architecture.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start development server with auto-reload |
| `npm test` | Run all unit tests |

## Code Style

- Use JSDoc comments for all functions (describe purpose, params, returns)
- Follow existing SOLID + CQRS architecture pattern
- Keep modules focused on single responsibility

## Project Structure

```
src/
├── models/        Data models and repositories
├── queries/       Read-only operations (Queries)
├── commands/      Write operations (Commands)
├── services/      Business logic layer
├── controllers/   HTTP request handlers
└── routes/        Route definitions
```

## Architecture Guidelines

- **Queries** (`src/queries/`): Read operations only, no side effects
- **Commands** (`src/commands/`): Write operations, modify state
- **Services** (`src/services/`): Orchestrate queries/commands, business logic
- **Controllers** (`src/controllers/`): Handle HTTP layer only
- **Routes** (`src/routes/`): Define URL mappings

## Testing

After making changes, always run:

```bash
npm test
```

All tests must pass before committing.

## Dependencies

- `express` - Web framework
- `cors` - Cross-origin support
- `jest` - Testing framework
- `supertest` - HTTP testing
