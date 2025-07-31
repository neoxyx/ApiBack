const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/images.controller');

router.get('/imagesbybreedid/:breed_id', imagesController.getImagesByBreedId);

module.exports = router;