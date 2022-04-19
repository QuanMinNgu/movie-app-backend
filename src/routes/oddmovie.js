const router = require('express').Router();
const oddMovieController = require('../controllers/oddMovieController');
const middleWareController = require('../controllers/middleWareController');

router.post('/create',middleWareController.verifyAdmin,oddMovieController.createOldMovie);
router.delete('/delete/:slug',middleWareController.verifyAdmin,oddMovieController.deleteOldMovie);
router.put('/update/:slug',middleWareController.verifyAdmin,oddMovieController.updateOldMovie);
router.get('/:slug',oddMovieController.getOne);
router.get('/',oddMovieController.getOldMovie);

module.exports = router;