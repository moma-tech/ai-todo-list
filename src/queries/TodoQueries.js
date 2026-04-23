/**
 * @fileoverview Todo Query Handlers
 * @description Handles all read operations (Queries) for todos following CQRS pattern.
 * Queries should be side-effect free and only return data.
 */

const { TodoRepository } = require('../models/Todo');

/**
 * Get all todos query handler
 * @description Retrieves all todo items from the repository
 * @returns {Promise<Object[]>} Array of all todo items
 */
async function getAllTodosQuery() {
  return TodoRepository.findAll();
}

/**
 * Get todo by ID query handler
 * @description Retrieves a single todo by its unique identifier
 * @param {number} id - The unique identifier of the todo
 * @returns {Promise<Object|null>} The todo item or null if not found
 */
async function getTodoByIdQuery(id) {
  return TodoRepository.findById(id);
}

module.exports = {
  getAllTodosQuery,
  getTodoByIdQuery,
};
