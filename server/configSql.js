/**
 * Script de configuration des routes d'accès au controller MySQL
 */

const express = require('express');
const router  = express.Router();

// on importe les controllers
const controllerSql = require('./controller/mysql/controllerSql.js');

// on définit les routes
// mysql :
router.get('/mysql/getPlayer', controllerSql.getPlayer);
router.post('/mysql/createPlayer', controllerSql.createPlayer);
router.post('/mysql/createGame', controllerSql.createGame);
router.post('/mysql/updateWinner', controllerSql.updateWinner);
router.post('/mysql/updateScore', controllerSql.updateRoundWonPlayer);
router.post('/mysql/updateWins', controllerSql.updateGameWonPlayer);
router.post('/mysql/addMove', controllerSql.addMoves);

module.exports = router;