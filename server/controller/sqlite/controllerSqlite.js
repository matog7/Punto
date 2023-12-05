const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../sqlite/punto_sqlite.db')

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Erreur de connexion à SQLite : ', err.message);
  } else {
    console.log('Connecté à SQLite');
  }
});

const getPlayer = async (req, res) => {
  const query = 'SELECT * FROM Player;';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des joueurs : ', err.message);
      res.status(500).json({ message: 'Erreur lors de la récupération des joueurs' });
    } else {
      console.log("joueurs : ", rows);
      res.json(rows);
    }
  });
};

const updateRoundWonPlayer = (req, res) => {
  const nom = req.body.winner;
  const update = "UPDATE Player SET roundWon = roundWon + 1 WHERE name = ?;";
  const verif = "SELECT * FROM Player WHERE name = ?;";

  db.get(verif, [nom], (err, row) => {
    if (err) {
      console.log(err);
      res.status(404).send('Joueur introuvable.\nRééssayez.');
    } else {
      if (row) {
        db.run(update, [nom], (err) => {
          if (err) {
            console.log(err);
            res.status(500).send('Une erreur s\'est produite lors de la mise à jour du joueur.\nRééssayez.');
          } else {
            console.log('Joueur mis à jour : ', nom);
            res.status(200).send('Joueur mis à jour !');
          }
        });
      }
    }
  });
};

const updateGameWonPlayer = (req, res) => {
  const nom = req.body.winner;
  const update = "UPDATE Player SET gameWon = gameWon + 1 WHERE name = ?;";
  const verif = "SELECT * FROM Player WHERE name = ?;";

  db.get(verif, [nom], (err, row) => {
    if (err) {
      console.log(err);
      res.status(404).send('Joueur introuvable.\nRééssayez.');
    } else {
      if (row) {
        db.run(update, [nom], (err) => {
          if (err) {
            console.log(err);
            res.status(500).send('Une erreur s\'est produite lors de la mise à jour du joueur.\nRééssayez.');
          } else {
            console.log('Joueur mis à jour : ', nom);
            res.status(200).send('Joueur mis à jour !');
          }
        });
      }
    }
  });
};

const createPlayer = (req, res) => {
  const nom = req.body.nom;
  const insert = "INSERT INTO Player(name, roundWon, gameWon) VALUES (?,?,?);";
  const verif = "SELECT * FROM Player WHERE name = ?;";

  db.get(verif, [nom], (err, row) => {
    if (err) {
      console.log(err);
    } else {
      if (row) {
        res.status(200).send('Ce joueur existe déjà, il ne sera pas inséré de nouveau.');
      } else {
        db.run(insert, [nom, 0, 0], (err) => {
          if (err) {
            console.log(err);
            res.status(500).send('Une erreur s\'est produite lors de l\'ajout du joueur.\nRééssayez.');
          } else {
            console.log('Joueur ajouté : ', nom);
            res.status(200).send('Joueur ajouté !');
          }
        });
      }
    }
  });
};

const createGame = (req, res) => {
  const nbJoueurs = req.body.nbJoueurs;
  const createTime = req.body.createTime;
  const insert = `INSERT INTO Game(nbPlayers, create_time) VALUES (?, ?);`;
  let insertedId;
  db.run(insert, [nbJoueurs, createTime], async (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Une erreur s\'est produite lors de l\'ajout de la partie.\nRééssayez.');
    } else {
      // on récupère l'ID de la partie ajoutée
      const autoIncrement = `SELECT ROWID from Game ORDER by ROWID desc LIMIT 1`;
      db.get(autoIncrement, [], async (err, row) => {
        if (err) {
          console.log(err);
        } else {
          insertedId = await row.id;
          await setState(insertedId);
          console.log('ID de la partie ajoutée : ', insertedId);
          res.status(200).send(`Partie ajoutée avec l'ID : ${insertedId}`);
          const insertPlayed = `INSERT INTO GamePlayed(game_id, winner) VALUES (?, ?);`;
          db.run(insertPlayed, [insertedId, null], (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Partie jouée ajoutée');
            }
          });
        }
      });
    }
  });
};

let s;
const setState = async (state) => {
  s = state;
  console.log("s", s);
};

const updateWinner = (req, res) => {
  const state = s;
  const winner = req.body.winner;
  const maj = "UPDATE GamePlayed SET winner = ? WHERE game_id = ?;";
  const verif = "SELECT * FROM GamePlayed WHERE game_id = ?;";

  db.get(verif, [state], (err, row) => {
    if (err) {
      console.log(err);
    } else {
      if (row) {
        db.run(maj, [winner, state], (err) => {
          if (err) {
            console.log(err);
            res.status(500).send('Une erreur s\'est produite lors de la mise à jour de la partie jouée.\nRééssayez.');
          } else {
            console.log('Partie jouée mise à jour : ', state);
            res.status(200).send('Partie jouée mise à jour !');
          }
        });
      } else {
        res.status(200).send('Cette partie n\'existe pas, elle ne sera pas mise à jour.');
      }
    }
  });
};

const addMoves = (req, res) => {
  // on récupère les données envoyées par le client
  const state = s;
  const player = req.body.player;
  const roundNumber = req.body.roundNumber;
  const move = req.body.move;
  const value = req.body.value;
  const color = req.body.color;
  const roundTime = new Date().toLocaleString();

  const insert = "INSERT INTO Movements(game_id, player_name, roundNumber, placement, value, color, roundTime) VALUES (?,?,?,?,?,?,?);";
  // on vérifie si la partie jouée existe 
  console.log("s pour insertion mouvement", s);
  db.run(insert, [state, player, roundNumber, move, value, color, roundTime], (err) => {
      if (err) {
          console.log(err);
          res.status(500).send('Une erreur s\'est produite lors de l\'ajout du joueur.\nRééssayez.');
      } else {
          console.log('Mouvement ajouté !');
          res.status(200).send('Mouvement ajouté !');
      }
  });
};

module.exports = { getPlayer, updateRoundWonPlayer, updateGameWonPlayer, createPlayer, createGame, updateWinner, addMoves };
