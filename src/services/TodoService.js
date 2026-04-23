/**
 * @fileoverview Todo Service Layer
 * @description Business logic layer that orchestrates queries and commands.
 * This service provides a clean API for the controllers and abstracts
 * the CQRS implementation details.
 */

const { getAllTodosQuery, getTodoByIdQuery } = require('../queries/TodoQueries');
const { createTodoCommand, updateTodoCommand, deleteTodoCommand } = require('../commands/TodoCommands');

/**
 * TodoService - Provides business logic for todo operations
 * Follows Single Responsibility Principle: only handles todo business logic
 */
class TodoService {
  /**
   * Get all todos
   * @returns {Promise<Object[]>} Array of all todos
   */
  static async getAllTodos() {
    return getAllTodosQuery();
  }

  /**
   * Get a single todo by ID
   * @param {number} id - The todo ID
   * @returns {Promise<Object|null>} The todo or null
   */
  static async getTodoById(id) {
    return getTodoByIdQuery(id);
  }

  /**
   * Create a new todo
   * @param {string} title - The todo title
   * @returns {Promise<{success: boolean, todo?: Object, error?: string}>}
   */
  static async createTodo(title) {
    return createTodoCommand(title);
  }

  /**
   * Update an existing todo
   * @param {number} id - The todo ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{success: boolean, todo?: Object, error?: string}>}
   */
  static async updateTodo(id, updates) {
    return updateTodoCommand(id, updates);
  }

  /**
   * Delete a todo
   * @param {number} id - The todo ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteTodo(id) {
    return deleteTodoCommand(id);
  }
}

module.exports = { TodoService };
