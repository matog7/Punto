/**
 * Script de connexion à la base de données MongoDB
*/

const { MongoClient } = require('mongodb'); // npm install mongodb -> pour les requêtes MongoDB

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

const getPlayer = async (req, res) => {
    try {
      await connectToMongoDB();
      const database = client.db('Punto'); // Remplacez par le nom de votre base de données
      const playersCollection = database.collection('Player'); // Remplacez par le nom de votre collection
  
      // Récupérer les joueurs depuis la collection
      const players = await playersCollection.find({}).toArray();
      res.json(players);
      console.log("joueurs : ", players);
    } catch (error) {
      console.error('Erreur lors de la récupération des joueurs : ', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des joueurs' });
    }
};

const updateRoundWonPlayer = async (req, res) => {
  try {
      await connectToMongoDB();
      const database = client.db('Punto');
      const playersCollection = database.collection('Player');
      const nom = req.body.winner;
      console.log(nom, "recup")
      const player = await playersCollection.findOne({ name: nom });
      
      if (player) {
          await playersCollection.updateOne(
              { name: nom },
              { $inc: { roundWon: 1 } }
          );
          console.log('Joueur mis à jour !');
          res.status(200).send('Joueur mis à jour !');
      } else {
          res.status(404).send('Joueur introuvable.\nRééssayez.');
      }
  } catch (error) {
      console.error('Erreur lors de la mise à jour du joueur : ', error);
      res.status(500).send('Une erreur s\'est produite lors de la mise à jour du joueur.\nRééssayez.');
  }
};


const updateGameWonPlayer = async (req, res) => {
  try {
      await connectToMongoDB();
      const database = client.db('Punto');
      const playersCollection = database.collection('Player');
      const nom = req.body.winner;
      const player = await playersCollection.findOne({ name: nom });
      
      if (player) {
          await playersCollection.updateOne(
              { name: nom },
              { $inc: { gameWon: 1 } }
          );
          console.log('Joueur mis à jour !');
          res.status(200).send('Joueur mis à jour !');
      } else {
          res.status(404).send('Joueur introuvable.\nRééssayez.');
      }
  } catch (error) {
      console.error('Erreur lors de la mise à jour du joueur : ', error);
      res.status(500).send('Une erreur s\'est produite lors de la mise à jour du joueur.\nRééssayez.');
  }
};

const createPlayer = async (req, res) => {
  try {
      await connectToMongoDB();
      const database = client.db('Punto');
      const playersCollection = database.collection('Player');
      const nom = req.body.nom;
      const player = await playersCollection.findOne({ name: nom });
      
      if (player) {
          res.status(200).send('Ce joueur existe déjà, il ne sera pas inséré de nouveau.');
          console.log("joueur déjà existant");
      } else {
          await playersCollection.insertOne({ name: nom, roundWon: 0, gameWon: 0 });
          console.log('Joueur ajouté !');
          res.status(200).send('Joueur ajouté !');
      }
  } catch (error) {
      console.error('Erreur lors de l\'ajout du joueur : ', error);
      res.status(500).send('Une erreur s\'est produite lors de l\'ajout du joueur.\nRééssayez.');
  }
};

const createGame = async (req, res) => {
  try {
      const nbJoueurs = req.body.nbJoueurs;
      const createTime = req.body.createTime;

      await connectToMongoDB();
      const database = client.db('Punto');
      const gamesCollection = database.collection('Game');

      const insertedGame = await gamesCollection.insertOne({
          nbPlayers: nbJoueurs,
          create_time: createTime
      });

      const insertedId = insertedGame.insertedId;
      console.log('ID de la partie ajoutée : ', insertedId);
      await setState(insertedId);

      const gamePlayedCollection = database.collection('GamePlayed');
      await gamePlayedCollection.insertOne({
          game_id: insertedId,
          winner: null
      });

      res.status(200).send(`Partie ajoutée avec l'ID : ${insertedId}`);
  } catch (error) {
      console.error('Une erreur s\'est produite lors de l\'ajout de la partie : ', error);
      res.status(500).send('Une erreur s\'est produite lors de l\'ajout de la partie.\nRééssayez.');
  }
};

let s = 0;
const setState = async (state) => {
  s = state;
  console.log("s", s);
};

const updateWinner = async (req, res) => {
  try {
      const state = s;
      const winner = req.body.winner;

      await connectToMongoDB();
      const database = client.db('Punto');
      const gamePlayedCollection = database.collection('GamePlayed');

      const gamePlayed = await gamePlayedCollection.findOne({ game_id: state });

      if (gamePlayed) {
          await gamePlayedCollection.updateOne(
              { game_id: state },
              { $set: { winner: winner } }
          );
          console.log('Partie jouée mise à jour !');
          res.status(200).send('Partie jouée mise à jour !');
      } else {
          res.status(200).send('Cette partie n\'existe pas, elle ne sera pas mise à jour.');
      }
  } catch (error) {
      console.error('Une erreur s\'est produite lors de la mise à jour de la partie jouée : ', error);
      res.status(500).send('Une erreur s\'est produite lors de la mise à jour de la partie jouée.\nRééssayez.');
  }
};

const addMoves = async (req, res) => {
  try {
      const state = s;
      const player = req.body.player;
      const roundNumber = req.body.roundNumber;
      const move = req.body.move;
      const value = req.body.value;
      const color = req.body.color;
      const roundTime = new Date().toLocaleString();

      await connectToMongoDB();
      const database = client.db('Punto');
      const movementsCollection = database.collection('Movements');

      await movementsCollection.insertOne({
          game_id: state,
          player_name: player,
          roundNumber: roundNumber,
          placement: move,
          value: value,
          color: color,
          roundTime: roundTime
      });

      console.log('Mouvement ajouté !');
      res.status(200).send('Mouvement ajouté !');
  } catch (error) {
      console.error('Une erreur s\'est produite lors de l\'ajout du mouvement : ', error);
      res.status(500).send('Une erreur s\'est produite lors de l\'ajout du mouvement.\nRééssayez.');
  }
};


module.exports = {getPlayer, updateRoundWonPlayer, updateGameWonPlayer, createPlayer, createGame, updateWinner, addMoves};