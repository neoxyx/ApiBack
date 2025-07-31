const request = require('supertest');
const app = require('../../app');
const Cat = require('../models/cat.model');
const { connectDB, closeDB } = require('../config/db');

describe('Cats Controller', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await Cat.deleteMany({});
  });

  describe('GET /api/cats/breeds', () => {
    it('should return an empty array when no breeds exist', async () => {
      const res = await request(app).get('/api/cats/breeds');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });

    it('should return all breeds from the database', async () => {
      const testBreed = {
        breedId: 'test1',
        name: 'Test Breed',
        description: 'A test breed',
        temperament: 'Friendly'
      };
      await Cat.create(testBreed);
      
      const res = await request(app).get('/api/cats/breeds');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe(testBreed.name);
    });
  });

  describe('GET /api/cats/breeds/:breed_id', () => {
    it('should return 404 when breed does not exist', async () => {
      const res = await request(app).get('/api/cats/breeds/nonexistent');
      expect(res.statusCode).toEqual(404);
    });

    it('should return the breed when it exists', async () => {
      const testBreed = {
        breedId: 'test2',
        name: 'Test Breed 2'
      };
      await Cat.create(testBreed);
      
      const res = await request(app).get(`/api/cats/breeds/${testBreed.breedId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe(testBreed.name);
    });
  });

  describe('GET /api/cats/breeds/search', () => {
    it('should return 400 when no query parameter is provided', async () => {
      const res = await request(app).get('/api/cats/breeds/search');
      expect(res.statusCode).toEqual(400);
    });

    it('should return matching breeds', async () => {
      const testBreed1 = {
        breedId: 'test3',
        name: 'Siamese',
        temperament: 'Active, Intelligent'
      };
      const testBreed2 = {
        breedId: 'test4',
        name: 'Persian',
        temperament: 'Quiet, Gentle'
      };
      await Cat.create([testBreed1, testBreed2]);
      
      const res = await request(app).get('/api/cats/breeds/search?q=siamese');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Siamese');
    });
  });
});