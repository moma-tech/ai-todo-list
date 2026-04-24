/**
 * @fileoverview Todo Model Definition
 * @description Defines the Todo data structure and repository with encrypted file storage.
 */

const fs = require('fs');
const path = require('path');
const { encrypt, decryptJSON } = require('../utils/encryption');

/**
 * @typedef {Object} Todo
 * @property {number} id - Unique identifier for the todo item
 * @property {string} title - The title/description of the todo
 * @property {boolean} completed - Whether the todo is completed
 */

/**
 * Path to the encrypted data file
 * @type {string}
 */
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '../../data/todos.enc');

/**
 * In-memory cache of todos
 * @type {Todo[]}
 */
let todos = null;

/**
 * Load todos from encrypted file
 * @description Reads and decrypts the data file, returns empty array if not exists
 * @returns {Todo[]} Array of todo items
 */
function loadTodos() {
  if (todos !== null) {
    return todos;
  }
  
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
      const encryptedData = JSON.parse(fileContent);
      todos = decryptJSON(encryptedData);
    } else {
      todos = [];
    }
  } catch (error) {
    console.error('Error loading todos:', error.message);
    todos = [];
  }
  
  return todos;
}

/**
 * Save todos to encrypted file
 * @description Encrypts and writes the todos array to disk
 * @returns {void}
 */
function saveTodos() {
  const encryptedData = encrypt(todos);
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(encryptedData), { mode: 0o600 });
}

/**
 * Get the next available ID
 * @returns {number} Next ID value
 */
function getNextId() {
  if (todos.length === 0) return 1;
  return Math.max(...todos.map(t => t.id)) + 1;
}

/**
 * TodoRepository - Handles data access for todo items
 * Implements the Repository pattern with encrypted file persistence
 */
class TodoRepository {
  /**
   * Get all todo items
   * @returns {Todo[]} Array of all todo items
   */
  static findAll() {
    return [...loadTodos()];
  }

  /**
   * Find a todo by its ID
   * @param {number} id - The unique identifier
   * @returns {Todo|undefined} The todo item or undefined if not found
   */
  static findById(id) {
    return loadTodos().find(t => t.id === id);
  }

  /**
   * Save a new todo item
   * @param {Todo} todo - The todo to save
   * @returns {Todo} The saved todo with generated ID
   */
  static save(todo) {
    loadTodos();
    const newTodo = { ...todo, id: getNextId() };
    todos.push(newTodo);
    saveTodos();
    return newTodo;
  }

  /**
   * Update an existing todo item
   * @param {number} id - The ID of the todo to update
   * @param {Partial<Todo>} updates - The fields to update
   * @returns {Todo|null} The updated todo or null if not found
   */
  static update(id, updates) {
    loadTodos();
    const todo = todos.find(t => t.id === id);
    if (!todo) return null;
    
    Object.assign(todo, updates);
    saveTodos();
    return todo;
  }

  /**
   * Delete a todo by ID
   * @param {number} id - The ID of the todo to delete
   * @returns {boolean} True if deleted, false if not found
   */
  static delete(id) {
    loadTodos();
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    todos.splice(index, 1);
    saveTodos();
    return true;
  }
}

module.exports = { TodoRepository };
