const sqldb = require('../controller/mysql/mysqlconnection');
const MongoClient = require('mongodb').MongoClient;

const mysqlConnection = sqldb.db;

// Configuration de la connexion MongoDB
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

const migrateDataFromMongoToMySQL = async () => {
    try {
        await connectToMongoDB();

        const mongoDB = client.db('Punto');

        // Migration des données de la collection Player de MongoDB vers la table Player de MySQL
        const playerCollection = mongoDB.collection('Player');
        const players = await playerCollection.find({}).toArray();

        players.forEach(async (player) => {
            const { name, roundWon, gameWon } = player;
            const insertQuery = `INSERT INTO Player(name, roundWon, gameWon) VALUES ('${name}', ${roundWon}, ${gameWon})`;

            mysqlConnection.query(insertQuery, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de joueurs insérée dans MySQL.');
                }
            });
        });

        // Répétez le processus pour chaque collection à migrer
        const gameCollection = mongoDB.collection('Game');
        const games = await gameCollection.find({}).toArray();

        games.forEach(async (game) => {
            const { nbPlayers, create_time } = game;
            const insertQuery = `INSERT INTO Game(nbPlayers, create_time) VALUES (${nbPlayers}, '${create_time}')`;

            mysqlConnection.query(insertQuery, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de partie insérée dans MySQL.');
                }
            });
        });

        const gamePlayedCollection = mongoDB.collection('GamePlayed');
        const gamesPlayed = await gamePlayedCollection.find({}).toArray();

        gamesPlayed.forEach(async (gamePlayed) => {
            const { game_id, winner } = gamePlayed;
            const insertQuery = `INSERT INTO GamePlayed(game_id, winner) VALUES (${game_id}, '${winner}')`;

            mysqlConnection.query(insertQuery, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de partie jouée insérée dans MySQL.');
                }
            });
        });

        const movementsCollection = mongoDB.collection('Movements');
        const movements = await movementsCollection.find({}).toArray();

        movements.forEach(async (movement) => {
            movement.roundTime = movement.roundTime.toString();
            const { game_id, player_id, roundNumber, placement, value, color, roundTime} = movement;
            const insertQuery = `INSERT INTO Movements(game_id, player_name, roundNumber, placement, value, color, roundTime) VALUES (${game_id}, ${player_id}, ${roundNumber}, ${placement}, ${value}, ${color}, ${roundTime})`;

            mysqlConnection.query(insertQuery, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Donnée de mouvement insérée dans MySQL.');
                }
            });
        });
    } catch (error) {
        console.error('Erreur lors de la migration : ', error);
    }
};

migrateDataFromMongoToMySQL();
