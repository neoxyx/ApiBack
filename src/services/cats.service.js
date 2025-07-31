const Cat = require('../models/cat.model');
const theCatApiService = require('./external/thecatapi.service');
const ApiError = require('../utils/apiError');

class CatsService {
  async getAllBreeds() {
    try {
      // Primero intentamos obtener de nuestra base de datos
      const localBreeds = await Cat.find().lean();
      
      if (localBreeds.length > 0) {
        return localBreeds;
      }
      
      // Si no hay datos locales, obtenemos de la API externa
      const apiBreeds = await theCatApiService.getBreeds();
      
      // Guardamos en nuestra base de datos para futuras consultas
      await Cat.insertMany(apiBreeds.map(breed => ({
        breedId: breed.id,
        name: breed.name,
        description: breed.description,
        temperament: breed.temperament,
        origin: breed.origin,
        lifeSpan: breed.life_span,
        adaptability: breed.adaptability,
        intelligence: breed.intelligence,
        referenceImageId: breed.reference_image_id
      })));
      
      return apiBreeds;
    } catch (error) {
      throw new ApiError(500, 'Error getting cat breeds');
    }
  }

  async getBreedById(breedId) {
    try {
      // Buscar primero en base de datos local
      const localBreed = await Cat.findOne({ breedId }).lean();
      
      if (localBreed) {
        return localBreed;
      }
      
      // Si no existe localmente, obtener de la API
      const apiBreed = await theCatApiService.getBreedById(breedId);
      
      // Guardar en base de datos para futuras consultas
      const newBreed = await Cat.create({
        breedId: apiBreed.id,
        name: apiBreed.name,
        description: apiBreed.description,
        temperament: apiBreed.temperament,
        origin: apiBreed.origin,
        lifeSpan: apiBreed.life_span,
        adaptability: apiBreed.adaptability,
        intelligence: apiBreed.intelligence,
        referenceImageId: apiBreed.reference_image_id
      });
      
      return newBreed.toObject();
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        throw error;
      }
      throw new ApiError(500, 'Error getting cat breed by ID');
    }
  }

  async searchBreeds(query) {
    try {
      // Primero buscar en base de datos local
      const localResults = await Cat.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { temperament: { $regex: query, $options: 'i' } }
        ]
      }).lean();
      
      if (localResults.length > 0) {
        return localResults;
      }
      
      // Si no hay resultados locales, buscar en la API
      const apiResults = await theCatApiService.searchBreeds(query);
      
      return apiResults;
    } catch (error) {
      throw new ApiError(500, 'Error searching cat breeds');
    }
  }
}

module.exports = new CatsService();