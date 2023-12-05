const sqldb = require('../controller/mysql/mysqlconnection');
const MongoClient = require('mongodb').MongoClient;

const mysqlConnection = sqldb.db;

// Configuration de la connexion MongoDB
// on récupère notre connexion par défaut à la bdd, cela va permettre de faire des requêtes sur la bdd
const mongoURI = 'mongodb://127.0.0.1:27017/Punto';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
    try {
      await client.connect();
      console.log('Connecté à MongoDB');
    } catch (error) {
      console.error('Erreur de connexion à MongoDB : ', error);
    }
}

const migrateDataFromMySQLToMongo= async () => {

    try {
        await connectToMongoDB();

        const mongoDB = client.db('Punto');

        // Migration des données de la table Player de MySQL vers une collection Player de MongoDB
        const selectPlayer = 'SELECT * FROM Player;';
        mysqlConnection.query(selectPlayer, (err, playerRows) => {
            if (err) {
                console.error(err);
                return;
            }

            const playerCollection = mongoDB.collection('Player');
            playerRows.forEach(row => {
                playerCollection.insertOne(row, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Donnée de joueurs insérée dans MongoDB.');
                    }
                });
            });
        });

        // Répétez le processus pour chaque table à migrer
        const selectGame = 'SELECT * FROM Game;';
        mysqlConnection.query(selectGame, (err, gameRows) => {
            if (err) {
                console.error(err);
                return;
            }

            const gameCollection = mongoDB.collection('Game');
            gameRows.forEach(row => {
                gameCollection.insertOne(row, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Donnée de partie insérée dans MongoDB.');
                    }
                });
            });
        });

        const selectGamePlayed = 'SELECT * FROM GamePlayed;';
        mysqlConnection.query(selectGamePlayed, (err, gamePlayedRows) => {
            if (err) {
                console.error(err);
                return;
            }

            const gamePlayedCollection = mongoDB.collection('GamePlayed');
            gamePlayedRows.forEach(row => {
                gamePlayedCollection.insertOne(row, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Donnée de partie jouée insérée dans MongoDB.');
                    }
                });
            });
        });

        const selectMovements = 'SELECT * FROM Movements;';
        mysqlConnection.query(selectMovements, (err, movementsRows) => {
            if (err) {
                console.error(err);
                return;
            }

            const movementsCollection = mongoDB.collection('Movements');
            movementsRows.forEach(row => {
                movementsCollection.insertOne(row, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Donnée de mouvements insérée dans MongoDB.');
                    }
                });
            });
        });
    } catch (error) {
        console.error('Erreur lors de la migration : ', error);
    }
}
migrateDataFromMySQLToMongo();