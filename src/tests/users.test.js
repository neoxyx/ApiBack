const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const { connectDB, closeDB } = require('../config/db');

describe('Users Controller', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('test@example.com');
      expect(res.body.data.name).toBe('Test User');
      expect(res.body.data.password).toBeUndefined();
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ email: 'test@example.com' });
      
      expect(res.statusCode).toEqual(400);
    });

    it('should fail with duplicate email', async () => {
      await User.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Existing User'
      });

      const res = await request(app)
        .post('/api/users/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
      
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await User.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('test@example.com');
      expect(res.body.data.password).toBeUndefined();
    });

    it('should fail with invalid password', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(401);
    });
  });
});