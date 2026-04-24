/**
 * @fileoverview Todo List SPA
 * @description Single Page Application for managing todos with vanilla JavaScript
 */

const API_BASE = '';

/**
 * TodoApp - Main application class
 */
class TodoApp {
  constructor() {
    this.todos = [];
    this.currentFilter = 'all';
    this.initElements();
    this.bindEvents();
    this.loadTodos();
  }

  initElements() {
    this.todoForm = document.getElementById('todo-form');
    this.todoInput = document.getElementById('todo-input');
    this.todoList = document.getElementById('todo-list');
    this.stats = document.getElementById('stats');
    this.modal = document.getElementById('modal');
    this.editForm = document.getElementById('edit-form');
    this.editId = document.getElementById('edit-id');
    this.editTitle = document.getElementById('edit-title');
    this.editCompleted = document.getElementById('edit-completed');
    this.cancelEdit = document.getElementById('cancel-edit');
    this.filterBtns = document.querySelectorAll('.filter-btn');
  }

  bindEvents() {
    this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
    this.editForm.addEventListener('submit', (e) => this.handleEditTodo(e));
    this.cancelEdit.addEventListener('click', () => this.hideModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hideModal();
    });
    
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
    });
  }

  async loadTodos() {
    try {
      const response = await fetch(`${API_BASE}/todos`);
      this.todos = await response.json();
      this.render();
    } catch (error) {
      console.error('Error loading todos:', error);
      this.todoList.innerHTML = '<p class="loading">Error loading todos</p>';
    }
  }

  async handleAddTodo(e) {
    e.preventDefault();
    const title = this.todoInput.value.trim();
    
    if (!title) return;

    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });

      if (response.ok) {
        const newTodo = await response.json();
        this.todos.push(newTodo);
        this.todoInput.value = '';
        this.render();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  async handleToggleComplete(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        const index = this.todos.findIndex(t => t.id === id);
        this.todos[index] = updatedTodo;
        this.render();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  async handleDelete(id) {
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.render();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  showEditModal(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;

    this.editId.value = id;
    this.editTitle.value = todo.title;
    this.editCompleted.checked = todo.completed;
    this.modal.classList.remove('hidden');
  }

  hideModal() {
    this.modal.classList.add('hidden');
  }

  async handleEditTodo(e) {
    e.preventDefault();
    const id = parseInt(this.editId.value);
    const title = this.editTitle.value.trim();
    const completed = this.editCompleted.checked;

    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed })
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        const index = this.todos.findIndex(t => t.id === id);
        this.todos[index] = updatedTodo;
        this.hideModal();
        this.render();
      }
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.render();
  }

  getFilteredTodos() {
    switch (this.currentFilter) {
      case 'active':
        return this.todos.filter(t => !t.completed);
      case 'completed':
        return this.todos.filter(t => t.completed);
      default:
        return this.todos;
    }
  }

  render() {
    const filteredTodos = this.getFilteredTodos();

    if (filteredTodos.length === 0) {
      this.todoList.innerHTML = `
        <div class="empty-state">
          <p>${this.currentFilter === 'all' ? 'No todos yet. Add one above!' : `No ${this.currentFilter} todos`}</p>
        </div>
      `;
    } else {
      this.todoList.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
          <input 
            type="checkbox" 
            class="todo-checkbox" 
            ${todo.completed ? 'checked' : ''} 
            onchange="app.handleToggleComplete(${todo.id})"
          >
          <span class="todo-title">${this.escapeHtml(todo.title)}</span>
          <div class="todo-actions">
            <button class="btn btn-secondary" onclick="app.showEditModal(${todo.id})">Edit</button>
            <button class="btn btn-danger" onclick="app.handleDelete(${todo.id})">Delete</button>
          </div>
        </div>
      `).join('');
    }

    this.renderStats();
  }

  renderStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const active = total - completed;

    this.stats.innerHTML = `${active} active, ${completed} completed of ${total} total`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

const app = new TodoApp();
