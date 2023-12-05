/**
 * Script de configuration des routes d'accès au controller MongoDB
 */

const express = require('express');
const router  = express.Router();

// on importe les controllers
const controllerMongo = require('./controller/mongodb/controllerMongo.js');

// on définit les routes
// mysql :
router.get('/mongodb/getPlayer', controllerMongo.getPlayer);
router.post('/mongodb/updateScore', controllerMongo.updateRoundWonPlayer);
router.post('/mongodb/createPlayer', controllerMongo.createPlayer);
router.post('/mongodb/createGame', controllerMongo.createGame);
router.post('/mongodb/updateWinner', controllerMongo.updateWinner);
router.post('/mongodb/updateWins', controllerMongo.updateGameWonPlayer);
router.post('/mongodb/addMove', controllerMongo.addMoves);


module.exports = router;