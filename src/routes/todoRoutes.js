/**
 * @fileoverview Todo Routes
 * @description Defines HTTP routes for todo endpoints.
 * Follows Single Responsibility Principle: only handles route definitions.
 * Maps URLs to controller methods.
 */

const express = require('express');
const { TodoController } = require('../controllers/TodoController');

const router = express.Router();

/**
 * GET / - Health check endpoint
 * @returns {Object} API status message
 */
router.get('/', TodoController.healthCheck);

/**
 * GET /todos - Retrieve all todos
 * @returns {Object[]} Array of all todo items
 */
router.get('/todos', TodoController.getAllTodos);

/**
 * GET /todos/:id - Retrieve a single todo
 * @param {string} id - Todo ID
 * @returns {Object} Todo object
 */
router.get('/todos/:id', TodoController.getTodoById);

/**
 * POST /todos - Create a new todo
 * @body {title: string} - Todo title (required)
 * @returns {Object} Created todo
 */
router.post('/todos', TodoController.createTodo);

/**
 * PUT /todos/:id - Update a todo
 * @param {string} id - Todo ID
 * @body {title?: string, completed?: boolean} - Fields to update
 * @returns {Object} Updated todo
 */
router.put('/todos/:id', TodoController.updateTodo);

/**
 * DELETE /todos/:id - Delete a todo
 * @param {string} id - Todo ID
 * @returns {void} No content (204)
 */
router.delete('/todos/:id', TodoController.deleteTodo);

module.exports = router;
