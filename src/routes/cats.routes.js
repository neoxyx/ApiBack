const express = require('express');
const router = express.Router();
const catsController = require('../controllers/cats.controller');

router.get('/breeds', catsController.getBreeds);
router.get('/breeds/:breed_id', catsController.getBreedById);
router.get('/breeds/search', catsController.searchBreeds);

module.exports = router;