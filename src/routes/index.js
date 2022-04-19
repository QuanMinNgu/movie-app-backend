const auth = require('./auth');
const oldMovie = require('./oddmovie');
function router(app){
    app.use('/api/auth',auth);
    app.use('/api/movie',oldMovie);
}

module.exports = router;