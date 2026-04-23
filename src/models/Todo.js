/**
 * @fileoverview Todo Model Definition
 * @description Defines the Todo data structure and repository for in-memory storage.
 */

/**
 * @typedef {Object} Todo
 * @property {number} id - Unique identifier for the todo item
 * @property {string} title - The title/description of the todo
 * @property {boolean} completed - Whether the todo is completed
 */

/**
 * In-memory storage for todo items.
 * @type {Todo[]}
 */
let todos = [
  { id: 1, title: 'Learn Express', completed: false },
  { id: 2, title: 'Build a REST API', completed: false },
];

/**
 * TodoRepository - Handles data access for todo items
 * Implements the Repository pattern for data persistence abstraction
 */
class TodoRepository {
  /**
   * Get all todo items
   * @returns {Todo[]} Array of all todo items
   */
  static findAll() {
    return [...todos];
  }

  /**
   * Find a todo by its ID
   * @param {number} id - The unique identifier
   * @returns {Todo|undefined} The todo item or undefined if not found
   */
  static findById(id) {
    return todos.find(t => t.id === id);
  }

  /**
   * Save a new todo item
   * @param {Todo} todo - The todo to save
   * @returns {Todo} The saved todo with generated ID
   */
  static save(todo) {
    const newTodo = { ...todo, id: todos.length + 1 };
    todos.push(newTodo);
    return newTodo;
  }

  /**
   * Update an existing todo item
   * @param {number} id - The ID of the todo to update
   * @param {Partial<Todo>} updates - The fields to update
   * @returns {Todo|null} The updated todo or null if not found
   */
  static update(id, updates) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return null;
    
    Object.assign(todo, updates);
    return todo;
  }

  /**
   * Delete a todo by ID
   * @param {number} id - The ID of the todo to delete
   * @returns {boolean} True if deleted, false if not found
   */
  static delete(id) {
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    todos.splice(index, 1);
    return true;
  }
}

module.exports = { TodoRepository };
