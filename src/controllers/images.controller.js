const imagesService = require('../services/images.service');
const ApiError = require('../utils/apiError');

class ImagesController {
  async getImagesByBreedId(req, res, next) {
    try {
      const { breed_id } = req.params;
      const { 
        limit = 10, 
        page = 1, 
        order = 'desc', 
        mime_types = 'jpg,png' 
      } = req.query;

      // Convertir parámetros a números
      const numericLimit = parseInt(limit);
      const numericPage = parseInt(page);

      if (isNaN(numericLimit)) {
        throw new ApiError(400, 'Limit must be a number');
      }

      if (isNaN(numericPage)) {
        throw new ApiError(400, 'Page must be a number');
      }

      const result = await imagesService.getImagesByBreedId(breed_id, {
        limit: numericLimit,
        page: numericPage,
        order,
        mime_types: mime_types.split(',')
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ImagesController();