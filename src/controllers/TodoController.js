/**
 * @fileoverview Todo Controller
 * @description Handles HTTP requests for todo endpoints.
 * Follows Single Responsibility Principle: only handles request/response handling.
 * Delegates business logic to TodoService.
 */

const { TodoService } = require('../services/TodoService');

/**
 * TodoController - Handles HTTP requests for todo operations
 * Acts as an adapter between HTTP layer and service layer
 */
class TodoController {
  /**
   * Health check endpoint handler
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   */
  static async healthCheck(req, res) {
    res.json({ message: 'Todo API is running' });
  }

  /**
   * Get all todos handler
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   */
  static async getAllTodos(req, res) {
    const todos = await TodoService.getAllTodos();
    res.json(todos);
  }

  /**
   * Get single todo by ID handler
   * @param {import('express').Request} req - Express request
   * @param {string} req.params.id - Todo ID from URL
   * @param {import('express').Response} res - Express response
   */
  static async getTodoById(req, res) {
    const id = parseInt(req.params.id);
    const todo = await TodoService.getTodoById(id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  }

  /**
   * Create new todo handler
   * @param {import('express').Request} req - Express request
   * @param {string} req.body.title - Todo title from request body
   * @param {import('express').Response} res - Express response
   */
  static async createTodo(req, res) {
    const { title } = req.body;
    const result = await TodoService.createTodo(title);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json(result.todo);
  }

  /**
   * Update existing todo handler
   * @param {import('express').Request} req - Express request
   * @param {string} req.params.id - Todo ID from URL
   * @param {Object} req.body - Update data from request body
   * @param {import('express').Response} res - Express response
   */
  static async updateTodo(req, res) {
    const id = parseInt(req.params.id);
    const result = await TodoService.updateTodo(id, req.body);

    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.json(result.todo);
  }

  /**
   * Delete todo handler
   * @param {import('express').Request} req - Express request
   * @param {string} req.params.id - Todo ID from URL
   * @param {import('express').Response} res - Express response
   */
  static async deleteTodo(req, res) {
    const id = parseInt(req.params.id);
    const result = await TodoService.deleteTodo(id);

    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.status(204).send();
  }
}

module.exports = { TodoController };
