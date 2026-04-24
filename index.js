/**
 * @fileoverview Todo REST API Server (SOLID + CQRS Architecture)
 * @description Main application entry point following SOLID principles:
 * 
 * - Single Responsibility: Each module has one reason to change
 *   (Routes define URLs, Controllers handle HTTP, Services handle business logic)
 * 
 * - Open/Closed: Extensions via new services/controllers without modifying existing code
 * 
 * - Liskov Substitution: Repositories and services can be replaced with alternatives
 * 
 * - Interface Segregation: Each service/controller exposes only needed methods
 * 
 * - Dependency Inversion: High-level modules (controllers) depend on abstractions (services)
 * 
 * Architecture Flow:
 * Request -> Routes -> Controller -> Service -> Queries/Commands -> Repository
 * 
 * @author Ivan
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const todoRoutes = require('./src/routes/todoRoutes');

/**
 * Express application instance
 * @type {import('express').Application}
 */
const app = express();

/**
 * Server port number
 * @type {number}
 * @constant
 */
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/', todoRoutes);

/**
 * Start server if running as main module
 * Allows importing app for testing without starting server
 */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
