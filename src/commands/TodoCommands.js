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
 * Format date to yyyy/MM/dd
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * Validate date format yyyy/MM/dd
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} Whether the format is valid
 */
function isValidDateFormat(dateStr) {
  const regex = /^\d{4}\/\d{2}\/\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  const parts = dateStr.split('/');
  const date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
  return !isNaN(date.getTime());
}

/**
 * Get default scheduled date (7 days from now)
 * @returns {string} Formatted date string
 */
function getDefaultScheduledDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return formatDate(date);
}

/**
 * Create a new todo command handler
 * @description Creates a new todo item in the repository
 * @param {string} title - The title of the new todo
 * @param {string} [scheduledDate] - Scheduled date in yyyy/MM/dd format (defaults to 7 days from now)
 * @returns {Promise<CreateTodoResult>} Result containing the created todo or error
 */
async function createTodoCommand(title, scheduledDate) {
  if (!title || title.trim() === '') {
    return { success: false, error: 'Title is required' };
  }

  const finalScheduledDate = scheduledDate || getDefaultScheduledDate();
  
  if (!isValidDateFormat(finalScheduledDate)) {
    return { success: false, error: 'Invalid date format. Use yyyy/MM/dd' };
  }

  const todo = TodoRepository.save({
    title: title.trim(),
    completed: false,
    scheduledDate: finalScheduledDate,
  });

  return { success: true, todo };
}

/**
 * Update an existing todo command handler
 * @description Updates the title, completed status, and/or scheduled date of a todo
 * @param {number} id - The unique identifier of the todo to update
 * @param {Object} updates - The fields to update
 * @param {string} [updates.title] - New title (optional)
 * @param {boolean} [updates.completed] - New completed status (optional)
 * @param {string} [updates.scheduledDate] - New scheduled date in yyyy/MM/dd format (optional)
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
  if (updates.scheduledDate !== undefined) {
    if (!isValidDateFormat(updates.scheduledDate)) {
      return { success: false, error: 'Invalid date format. Use yyyy/MM/dd' };
    }
    updateData.scheduledDate = updates.scheduledDate;
  }

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
