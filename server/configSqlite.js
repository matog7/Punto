/**
 * Script de configuration des routes d'accès au controlles SQLite
 */

const express = require('express');
const router  = express.Router();

// on importe les controllers
const controllerSqlite = require('./controller/sqlite/controllerSqlite.js');

// on définit les routes
// sqlite :
router.get('/sqlite/getPlayer', controllerSqlite.getPlayer);
router.post('/sqlite/updateScore', controllerSqlite.updateRoundWonPlayer);
router.post('/sqlite/updateWins', controllerSqlite.updateGameWonPlayer);
router.post('/sqlite/createPlayer', controllerSqlite.createPlayer);
router.post('/sqlite/createGame', controllerSqlite.createGame);
router.post('/sqlite/updateWinner', controllerSqlite.updateWinner);
router.post('/sqlite/addMove', controllerSqlite.addMoves);


module.exports = router;