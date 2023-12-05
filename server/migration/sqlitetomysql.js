const sqldb = require('../controller/mysql/mysqlconnection');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const mysqlConnection = sqldb.db;
const dbPath = path.resolve(__dirname, '../sqlite/punto_sqlite.db');

const sqliteDB = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Erreur de connexion à SQLite : ', err.message);
    } else {
        console.log('Connecté à SQLite');
        migrateDataFromSQLiteToMySQL();
    }
});

const migrateDataFromSQLiteToMySQL = () => {
    // Table Player
    const selectPlayer = 'SELECT * FROM Player;';
    sqliteDB.all(selectPlayer, (err, playerRows) => {
        if (err) {
            console.error(err);
            return;
        }

        playerRows.forEach(row => {
            mysqlConnection.query('INSERT INTO Player(name, roundWon, gameWon) VALUES (?, ?, ?)', [row.name, row.roundWon, row.gameWon], (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de joueurs insérée dans MySQL.');
                }
            });
        });
    });

    // Table Game
    const selectGame = 'SELECT * FROM Game;';
    sqliteDB.all(selectGame, (err, gameRows) => {
        if (err) {
            console.error(err);
            return;
        }

        gameRows.forEach(row => {
            mysqlConnection.query('INSERT INTO Game(nbPlayers, create_time) VALUES (?, ?)', [row.nbPlayers, row.create_time], (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de partie insérée dans MySQL.');
                }
            });
        });
    });

    // Table GamePlayed
    const selectGamePlayed = 'SELECT * FROM GamePlayed;';
    sqliteDB.all(selectGamePlayed, (err, gamePlayedRows) => {
        if (err) {
            console.error(err);
            return;
        }

        gamePlayedRows.forEach(row => {
            mysqlConnection.query('INSERT INTO GamePlayed(game_id, winner) VALUES (?, ?)', [row.game_id, row.winner], (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de partie jouée insérée dans MySQL.');
                }
            });
        });
    });

    // Table Movements
    const selectMovements = 'SELECT * FROM Movements;';
    sqliteDB.all(selectMovements, (err, movementRows) => {
        if (err) {
            console.error(err);
            return;
        }

        movementRows.forEach(row => {
            mysqlConnection.query('INSERT INTO Movements(game_id, player_name, roundNumber, placement, value, color, roundTime) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                [row.game_id, row.player_name, row.roundNumber, row.placement, row.value, row.color, row.roundTime], (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de mouvement insérée dans MySQL.');
                }
            });
        });
    });
};


