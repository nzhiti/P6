const express = require('express');
const router = express.Router();
const controllerPepper = require('../controllers/pepper');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const rating = require('../middlewares/rating');

router.post('/', auth, multer, controllerPepper.createPepper);

router.put('/:id' , auth, multer, controllerPepper.updatePepper);

router.delete('/:id' , auth,  controllerPepper.deletePepper);

router.get('/:id', auth,  controllerPepper.getOnePepper);

router.get('/', auth,  controllerPepper.getAllPeppers);

router.post('/:id/like' , auth,  rating, controllerPepper.ratingOnePepper);

module.exports = router;
