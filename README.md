# AI Todo List

A simple Todo REST API built with Node.js and Express, following SOLID principles and CQRS architecture pattern.

## Features

- CRUD operations for todo items
- RESTful API design
- SOLID architecture principles
- CQRS (Command Query Responsibility Segregation) pattern
- Unit tests with Jest

## Project Structure

```
src/
├── models/        Todo.js - Data model and repository
├── queries/       TodoQueries.js - Read operations
├── commands/      TodoCommands.js - Write operations
├── services/      TodoService.js - Business logic layer
├── controllers/   TodoController.js - HTTP request handlers
└── routes/        todoRoutes.js - Route definitions
```

## Architecture

This project follows SOLID principles with CQRS pattern:

- **Single Responsibility**: Each module has one purpose
- **Open/Closed**: Easy to extend without modification
- **Liskov Substitution**: Repositories can be swapped
- **Interface Segregation**: Clean, focused interfaces
- **Dependency Inversion**: High-level modules depend on abstractions

**CQRS** separates read operations (Queries) from write operations (Commands) for better scalability and maintainability.

## Installation

```bash
npm install
```

## Usage

### Start server

```bash
npm start
```

### Development mode (with auto-reload)

```bash
npm run dev
```

### Run tests

```bash
npm test
```

## API Endpoints

| Method | Endpoint     | Description          | Body                    |
|--------|--------------|----------------------|-------------------------|
| GET    | /            | Health check         | -                       |
| GET    | /todos       | Get all todos        | -                       |
| GET    | /todos/:id   | Get single todo      | -                       |
| POST   | /todos       | Create todo          | `{ "title": "string" }` |
| PUT    | /todos/:id   | Update todo          | `{ "title"?, "completed"? }` |
| DELETE | /todos/:id   | Delete todo          | -                       |

## Example Requests

### Create a todo

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Node.js"}'
```

### Get all todos

```bash
curl http://localhost:3000/todos
```

### Update a todo

```bash
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete a todo

```bash
curl -X DELETE http://localhost:3000/todos/1
```

## Tech Stack

- Node.js
- Express.js
- Jest (testing)
- Supertest (API testing)

## License

ISC
