const catsService = require('../services/cats.service');
const ApiError = require('../utils/apiError');

class CatsController {
  async getBreeds(req, res, next) {
    try {
      const breeds = await catsService.getAllBreeds();
      res.json(breeds);
    } catch (error) {
      next(error);
    }
  }

  async getBreedById(req, res, next) {
    try {
      const { breed_id } = req.params;
      const breed = await catsService.getBreedById(breed_id);
      res.json(breed);
    } catch (error) {
      next(error);
    }
  }

  async searchBreeds(req, res, next) {
    try {
      const { q } = req.query;
      if (!q) {
        throw new ApiError(400, 'Search query parameter "q" is required');
      }
      const results = await catsService.searchBreeds(q);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CatsController();