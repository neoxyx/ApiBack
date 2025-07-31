const axios = require('axios');
const { CAT_API_KEY, CAT_API_URL } = require('../../config/env');
const ApiError = require('../../utils/apiError');

class TheCatApiService {
    constructor() {
        this.api = axios.create({
            baseURL: CAT_API_URL,
            headers: { 'x-api-key': CAT_API_KEY }
        });
    }

    async getBreeds() {
        try {
            const response = await this.api.get('/breeds');
            return response.data;
        } catch (error) {
            throw new ApiError(500, 'Error fetching breeds from TheCatAPI');
        }
    }

    async getBreedById(breedId) {
        try {
            const response = await this.api.get(`/breeds/${breedId}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new ApiError(404, 'Breed not found');
            }
            throw new ApiError(500, 'Error fetching breed from TheCatAPI');
        }
    }

    async searchBreeds(query) {
        try {
            const response = await this.api.get('/breeds/search', { params: { q: query } });
            return response.data;
        } catch (error) {
            throw new ApiError(500, 'Error searching breeds in TheCatAPI');
        }
    }

    async getBreedImages(breedId, limit = 1, options = {}) {
        try {
            const params = {
                breed_id: breedId,
                limit,
                ...options
            };

            const response = await this.api.get('/images/search', { params });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new ApiError(404, 'Breed not found in TheCatAPI');
            }
            throw new ApiError(500, 'Error fetching breed images from TheCatAPI');
        }
    }
}

module.exports = new TheCatApiService();