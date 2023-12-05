const sqldb = require('../controller/mysql/mysqlconnection');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const mysqlConnection = sqldb.db;
const dbPath = path.resolve(__dirname, '../sqlite/punto_sqlite.db')

const sqliteDB = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Erreur de connexion à SQLite : ', err.message);
  } else {
    console.log('Connecté à SQLite');
  }
});

// Les erreurs sont nomrales, elles sont dues au fait que les tables/données existent déjà, je n'ai pas eu le temps de faire la gestion des erreurs
const migrateDataFromMySQLToSQLite = () => {
    const selectPlayer = 'SELECT * FROM Player;';

    mysqlConnection.query(selectPlayer, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        rows.forEach(row => {
            // Adaptation nécessaire ici : insérer les données dans SQLite
            sqliteDB.run('INSERT INTO Player(name, roundWon, gameWon) VALUES (?, ?, ?)', [row.name, row.roundWon, row.gameWon], (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de joueurs insérée dans SQLite.');
                }
            });
        });
    });

    const selectGame = 'SELECT * FROM Game;';

    mysqlConnection.query(selectGame, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        rows.forEach(row => {
            // Adaptation nécessaire ici : insérer les données dans SQLite
            sqliteDB.run('INSERT INTO Game(nbPlayers, create_time) VALUES (?, ?)', [row.nbPlayers, row.create_time], (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de partie insérée dans SQLite.');
                }
            });
        });
    });

    const selectGamePlayed = 'SELECT * FROM GamePlayed;';

    mysqlConnection.query(selectGamePlayed, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        rows.forEach(row => {
            // Adaptation nécessaire ici : insérer les données dans SQLite
            sqliteDB.run('INSERT INTO GamePlayed(game_id, winner) VALUES (?, ?)', [row.game_id, row.winner], (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de partie jouée insérée dans SQLite.');
                }
            });
        });
    });

    const selectGameMovements = 'SELECT * FROM Movements;';

    mysqlConnection.query(selectGameMovements, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        rows.forEach(row => {
            // Adaptation nécessaire ici : insérer les données dans SQLite
            sqliteDB.run('INSERT INTO Movements(game_id, player_name, roundNumber, placement, value, color, roundTime) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                [row.game_id, row.player_name, row.roundNumber, row.placement, row.value, row.color, row.roundTime], (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de mouvements insérée dans SQLite.');
                }
            });
        });
    });
};

migrateDataFromMySQLToSQLite();