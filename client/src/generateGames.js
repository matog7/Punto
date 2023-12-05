import Axios from 'axios';
import React, { useState } from 'react';
import './static/home.css'
import { Alert } from '@mui/material';
import Helmet from 'react-helmet';

const GenerateGames = () => {
  const [numGames, setNumGames] = useState(1); // Nombre de parties à générer
  const [numPlayers, setNumPlayers] = useState(2); // Nombre de joueurs par partie
  const [selectedDB, setSelectedDB] = useState(''); // Base de données sélectionnée
  const [error, setError] = useState(false); // Erreur de saisie

  const handleNumGamesChange = (e) => {
    setNumGames(parseInt(e.target.value));
  };

  const handleNumPlayersChange = (e) => {
    setNumPlayers(parseInt(e.target.value));
  };

  const handleClick = () => {
    window.location.href = '/';
  };

  const handleGenerate = () => {
    Axios.post('http://localhost:3001/dbChoice', {selectedDatabase: selectedDB});
    const joueurs = [];
    for (let i = 0; i < numPlayers; i++) {
      joueurs.push(`Joueur ${i + 1}`);
    }
    
    // Insertion en base de la partie et des joueurs
    // Envoie des données pour la génération vers la base de données sélectionnée
    // Création de joueur
    joueurs.forEach(joueur => {
        Axios.post(`http://localhost:3001/api/${selectedDB}/createPlayer`, {nom: joueur}).then(async (res) => {
            if (res.status === 200){
                console.log(res.data); // Affichage de l'ID du joueur
                setError(false);
            } else {
                setError(true);
            }
        });
    })
    // Création de partie et de partie jouée
    for (let i = 0; i < numGames; i++) {
        Axios.post(`http://localhost:3001/api/${selectedDB}/createGame`, {
            nbJoueurs: Math.floor(Math.random() * 3) + 2, // afin de générer un chiffre entre 2 et 4
            createTime: new Date().toLocaleString(),
        }).then(async (res) => {
            console.log(res.data); // Affichage de l'ID de la partie
        });
    }
    
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Punto - Génération de parties</title>
      </Helmet>
      <h2>Générer des parties</h2>
      <div className="generator">
        <label htmlFor="numPlayers">Nombre de joueurs à générer : </label>
        <input type="number" id="numPlayer" value={numPlayers} onChange={handleNumPlayersChange} />
        <label htmlFor="numGames">Nombre de parties à générer : </label>
        <input type="number" id="numGames" value={numGames} onChange={handleNumGamesChange} />
      </div>
      <div  className="generator">
        <label htmlFor="selectDB">Base de données :</label>
        <select id="selectDB" onChange={e => setSelectedDB(e.target.value)}>
          <option value={'empty'}>3 options :</option>
          <option value={'mysql'}>MySQL</option>
          <option value={'mongodb'}>MongoDB</option>
          <option value={'sqlite'}>SQLite</option>
        </select>
      </div>
      <div className="generator-buttons">
        <button onClick={handleGenerate}>Générer</button>
        <button onClick={handleClick}>Retour</button>
      </div>
      {error ? <Alert severety="danger" message="">Une erreur s'est produite lors de la génération.</Alert> : ""}
    </div>
  );
};

export default GenerateGames;