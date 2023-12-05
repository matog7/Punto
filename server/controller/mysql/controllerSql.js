/**
 * Controller MySql
*/

const database = require('./mysqlconnection');
const db = database.db;

const getPlayer = (req, res) => {
    const select = "SELECT * FROM Player;";

    db.query(select, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("joueurs : ", result);
            res.send(result);
        }
    });
};

const updateRoundWonPlayer = (req, res) => {
    const nom = req.body.winner;
    const update = "UPDATE Player SET roundWon = roundWon + 1 WHERE name = ?;";
    const verif = "SELECT * FROM Player WHERE name = ?;";
    // on vérifie si le joueur existe déjà
    db.query(verif, [nom], (err, result) => {
        if (err) {
            console.log(err);
            res.status(404).send('Joueur introuvable.\nRééssayez.');
        } else {
            if (result.length > 0) {
                // on met à jour le joueur
                db.query(update, [nom],(err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Une erreur s\'est produite lors de la mise à jour du joueur.\nRééssayez.');
                    } else {
                        console.log('Joueur mis à jour : ', result);
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
    // on vérifie si le joueur existe déjà
    db.query(verif, [nom], (err, result) => {
        if (err) {
            console.log(err);
            res.status(404).send('Joueur introuvable.\nRééssayez.');
        } else {
            if (result.length > 0) {
                // on met à jour le joueur  
                db.query(update, [nom],(err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Une erreur s\'est produite lors de la mise à jour du joueur.\nRééssayez.');
                    } else {
                        console.log('Joueur mis à jour : ', result);
                        res.status(200).send('Joueur mis à jour !');
                    }
                });
            }
        }
    });
};


const createPlayer = (req, res) => {
    // on récupère les données envoyées par le client
    const nom = req.body.nom;
    const insert = "INSERT INTO Player(name, roundWon, gameWon) VALUES (?,?,?);";
    const verif = "SELECT * FROM Player WHERE name = ?;";
    // on vérifie si le joueur existe déjà
    db.query(verif, [nom], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                res.status(200).send('Ce joueur existe déjà, il ne sera pas inséré de nouveau.');
            } else {
                // on ajoute le joueur dans la base de données
                db.query(insert, [nom, 0, 0],(err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Une erreur s\'est produite lors de l\'ajout du joueur.\nRééssayez.');
                    } else {
                        console.log('Joueur ajouté : ', result);
                        res.status(200).send('Joueur ajouté !');
                    }
                });
            }
        }
    });
};


const createGame = (req, res) => {
    // on récupère les données envoyées par le client
    const nbJoueurs = req.body.nbJoueurs;
    const createTime = req.body.createTime;

    const insert = `INSERT INTO Game(nbPlayers, create_time) VALUES (?, ?);`;
    
    let insertedId;
    // on ajoute la partie dans la base de données
    db.query(insert, [nbJoueurs, createTime], async(err, result) => {
        if (err) { 
            console.log(err);
            res.status(500).send('Une erreur s\'est produite lors de l\'ajout de la partie.\nRééssayez.');
        } else {
            insertedId = await result.insertId; // Récupération de l'ID auto-incrémenté
            console.log('ID de la partie ajoutée : ', insertedId);
            await setState(insertedId);
            res.status(200).send(`Partie ajoutée avec l'ID : ${insertedId}`);
        }
        // on crée une partie jouée, stockant l'id de la partie et le gagnant
        const insertPlayed = `INSERT INTO GamePlayed(game_id, winner) VALUES (?, ?);`;
        db.query(insertPlayed, [insertedId, null],(err, result) => {
            if (err) { 
                console.log(err);
                res.status(500).send('Une erreur s\'est produite lors de l\'ajout de la partie jouée.\nRééssayez.');
            } else {
                console.log('Partie jouée ajoutée : ', result);
            }
        });
    });
}

let s = 0;
const setState = async (state) => {
    s = state;
    console.log("s", s);
}

const updateWinner = (req, res) => {
    // on récupère les données envoyées par le client
    const state = s;
    const winner = req.body.winner;
    const maj = "UPDATE GamePlayed SET winner = ? WHERE game_id = ? ;";
    const verif = "SELECT * FROM GamePlayed WHERE game_id = ?;";
    // on vérifie si la partie jouée existe 
    console.log("s pour update", s);
    db.query(verif, [state], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                // on met à jour la partie jouée
                db.query(maj, [winner, s],(err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Une erreur s\'est produite lors de la mise à jour de la partie jouée.\nRééssayez.');
                    } else {
                        console.log('Partie jouée mise à jour : ', result);
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
    db.query(insert, [state, player, roundNumber, move, value, color, roundTime], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Une erreur s\'est produite lors de l\'ajout du joueur.\nRééssayez.');
        } else {
            console.log('Mouvement ajouté : ', result);
            res.status(200).send('Mouvement ajouté !');
        }
    });
};
     


module.exports = {getPlayer, updateRoundWonPlayer, updateGameWonPlayer, createPlayer, createGame, updateWinner, addMoves};