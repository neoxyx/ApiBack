const Image = require('../models/image.model');
const Cat = require('../models/cat.model');
const theCatApiService = require('./external/thecatapi.service');
const ApiError = require('../utils/apiError');

class ImagesService {
  // Método existente para obtener imágenes por breedId
  async getBreedImages(breedId, limit = 1) {
    try {
      // Verificar si la raza existe
      const breedExists = await Cat.exists({ breedId });
      if (!breedExists) {
        throw new ApiError(404, 'Breed not found');
      }
      
      // Primero buscar imágenes en base de datos local
      const localImages = await Image.find({ breedId }).limit(limit).lean();
      
      if (localImages.length >= limit) {
        return localImages.slice(0, limit);
      }
      
      // Si no hay suficientes imágenes locales, obtener de la API
      const apiImages = await theCatApiService.getBreedImages(breedId, limit - localImages.length);
      
      // Guardar nuevas imágenes en base de datos
      const newImages = await Image.insertMany(apiImages.map(img => ({
        imageId: img.id,
        breedId,
        url: img.url,
        width: img.width,
        height: img.height
      })));
      
      return [...localImages, ...newImages.map(img => img.toObject())].slice(0, limit);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Error getting breed images');
    }
  }

  // Nuevo método para obtener imágenes por breedId con parámetros flexibles
  async getImagesByBreedId(breedId, options = {}) {
    try {
      // Validar que la raza exista
      const breed = await Cat.findOne({ breedId }).lean();
      if (!breed) {
        throw new ApiError(404, 'Breed not found');
      }

      // Configurar opciones por defecto
      const { 
        limit = 10, 
        page = 1, 
        order = 'desc', 
        mime_types = ['jpg,png'] 
      } = options;

      // Validar parámetros
      if (limit < 1 || limit > 50) {
        throw new ApiError(400, 'Limit must be between 1 and 50');
      }

      if (page < 1) {
        throw new ApiError(400, 'Page must be greater than 0');
      }

      // Calcular paginación
      const skip = (page - 1) * limit;

      // Buscar en base de datos local primero
      let images = await Image.find({ breedId })
        .sort({ createdAt: order === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Si no hay suficientes imágenes locales, obtener de la API externa
      if (images.length < limit) {
        const apiImages = await theCatApiService.getBreedImages(
          breedId, 
          limit - images.length,
          { order, mime_types }
        );

        // Guardar nuevas imágenes en la base de datos
        const newImages = await Image.insertMany(apiImages.map(img => ({
          imageId: img.id,
          breedId,
          url: img.url,
          width: img.width,
          height: img.height,
          mimeType: img.mime_type
        })));

        images = [...images, ...newImages.map(img => img.toObject())];
      }

      // Obtener el conteo total de imágenes para esta raza
      const totalCount = await Image.countDocuments({ breedId });
      const totalPages = Math.ceil(totalCount / limit);

      return {
        images,
        pagination: {
          total: totalCount,
          limit,
          page,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        breedInfo: {
          name: breed.name,
          breedId: breed.breedId
        }
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Error getting images by breed ID');
    }
  }
}

module.exports = new ImagesService();