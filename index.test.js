const request = require('supertest');
const app = require('./index');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'todos.enc');
const KEY_FILE = path.join(__dirname, 'data', '.key');

describe('Todo API', () => {
  beforeEach(() => {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
  });

  describe('GET /api/status', () => {
    it('should return API status', async () => {
      const res = await request(app).get('/api/status');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Todo API is running');
    });
  });

  describe('GET /todos', () => {
    it('should return all todos', async () => {
      const res = await request(app).get('/todos');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return a single todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Test todo' });
      const todoId = createRes.body.id;

      const res = await request(app).get(`/todos/${todoId}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(todoId);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app).get('/todos/999');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: 'Test todo' });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test todo');
      expect(res.body.completed).toBe(false);
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/todos')
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update a todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Original todo' });
      const todoId = createRes.body.id;

      const res = await request(app)
        .put(`/todos/${todoId}`)
        .send({ title: 'Updated todo', completed: true });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated todo');
      expect(res.body.completed).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app)
        .put('/todos/999')
        .send({ title: 'Updated' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .send({ title: 'Todo to delete' });
      const todoId = createRes.body.id;

      const deleteRes = await request(app).delete(`/todos/${todoId}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await request(app).get(`/todos/${todoId}`);
      expect(getRes.status).toBe(404);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app).delete('/todos/999');
      expect(res.status).toBe(404);
    });
  });
});
