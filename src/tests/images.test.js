const request = require('supertest');
const app = require('../../app');
const Cat = require('../models/cat.model');
const Image = require('../models/image.model');
const { connectDB, closeDB } = require('../config/db');

describe('Images Controller', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await Cat.deleteMany({});
    await Image.deleteMany({});
  });

  describe('GET /api/imagesbybreedid/:breed_id', () => {
    it('should return 404 when breed does not exist', async () => {
      const res = await request(app).get('/api/imagesbybreedid/nonexistent');
      expect(res.statusCode).toEqual(404);
    });

    it('should return images with pagination info', async () => {
      const testBreed = {
        breedId: 'test7',
        name: 'Test Breed for Images'
      };
      await Cat.create(testBreed);
      
      const testImages = Array(15).fill().map((_, i) => ({
        imageId: `img${i}`,
        breedId: 'test7',
        url: `http://example.com/image${i}.jpg`,
        createdAt: new Date(Date.now() - i * 1000) // Para tener diferentes fechas
      }));
      await Image.create(testImages);
      
      const res = await request(app).get('/api/imagesbybreedid/test7?limit=5&page=2');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.images.length).toBe(5);
      expect(res.body.data.pagination.total).toBe(15);
      expect(res.body.data.pagination.page).toBe(2);
      expect(res.body.data.pagination.totalPages).toBe(3);
      expect(res.body.data.breedInfo.name).toBe(testBreed.name);
    });

    it('should respect the order parameter', async () => {
      const testBreed = {
        breedId: 'test8',
        name: 'Test Breed Order'
      };
      await Cat.create(testBreed);
      
      const testImages = [
        { imageId: 'imgA', breedId: 'test8', url: 'http://example.com/A.jpg', createdAt: new Date('2023-01-01') },
        { imageId: 'imgB', breedId: 'test8', url: 'http://example.com/B.jpg', createdAt: new Date('2023-01-02') },
        { imageId: 'imgC', breedId: 'test8', url: 'http://example.com/C.jpg', createdAt: new Date('2023-01-03') }
      ];
      await Image.create(testImages);
      
      const resAsc = await request(app).get('/api/imagesbybreedid/test8?order=asc');
      expect(resAsc.body.data.images[0].imageId).toBe('imgA');
      
      const resDesc = await request(app).get('/api/imagesbybreedid/test8?order=desc');
      expect(resDesc.body.data.images[0].imageId).toBe('imgC');
    });

    it('should validate limit parameter', async () => {
      const testBreed = {
        breedId: 'test9',
        name: 'Test Breed Validation'
      };
      await Cat.create(testBreed);
      
      const resNegative = await request(app).get('/api/imagesbybreedid/test9?limit=0');
      expect(resNegative.statusCode).toEqual(400);
      
      const resHigh = await request(app).get('/api/imagesbybreedid/test9?limit=51');
      expect(resHigh.statusCode).toEqual(400);
      
      const resString = await request(app).get('/api/imagesbybreedid/test9?limit=abc');
      expect(resString.statusCode).toEqual(400);
    });
  });
});