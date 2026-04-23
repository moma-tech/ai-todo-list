/**
 * @fileoverview Todo Command Handlers
 * @description Handles all write operations (Commands) for todos following CQRS pattern.
 * Commands modify state and should not return data (only success/failure status).
 */

const { TodoRepository } = require('../models/Todo');

/**
 * Create todo command result
 * @typedef {Object} CreateTodoResult
 * @property {boolean} success - Whether the command succeeded
 * @property {Object} [todo] - The created todo (on success)
 * @property {string} [error] - Error message (on failure)
 */

/**
 * Update todo command result
 * @typedef {Object} UpdateTodoResult
 * @property {boolean} success - Whether the command succeeded
 * @property {Object} [todo] - The updated todo (on success)
 * @property {string} [error] - Error message (on failure)
 */

/**
 * Delete todo command result
 * @typedef {Object} DeleteTodoResult
 * @property {boolean} success - Whether the command succeeded
 * @property {string} [error] - Error message (on failure)
 */

/**
 * Create a new todo command handler
 * @description Creates a new todo item in the repository
 * @param {string} title - The title of the new todo
 * @returns {Promise<CreateTodoResult>} Result containing the created todo or error
 */
async function createTodoCommand(title) {
  if (!title || title.trim() === '') {
    return { success: false, error: 'Title is required' };
  }

  const todo = TodoRepository.save({
    title: title.trim(),
    completed: false,
  });

  return { success: true, todo };
}

/**
 * Update an existing todo command handler
 * @description Updates the title and/or completed status of a todo
 * @param {number} id - The unique identifier of the todo to update
 * @param {Object} updates - The fields to update
 * @param {string} [updates.title] - New title (optional)
 * @param {boolean} [updates.completed] - New completed status (optional)
 * @returns {Promise<UpdateTodoResult>} Result containing the updated todo or error
 */
async function updateTodoCommand(id, updates) {
  const existingTodo = TodoRepository.findById(id);
  if (!existingTodo) {
    return { success: false, error: 'Todo not found' };
  }

  const updateData = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.completed !== undefined) updateData.completed = updates.completed;

  const updatedTodo = TodoRepository.update(id, updateData);
  return { success: true, todo: updatedTodo };
}

/**
 * Delete a todo command handler
 * @description Permanently removes a todo from the repository
 * @param {number} id - The unique identifier of the todo to delete
 * @returns {Promise<DeleteTodoResult>} Result indicating success or error
 */
async function deleteTodoCommand(id) {
  const deleted = TodoRepository.delete(id);
  if (!deleted) {
    return { success: false, error: 'Todo not found' };
  }

  return { success: true };
}

module.exports = {
  createTodoCommand,
  updateTodoCommand,
  deleteTodoCommand,
};
