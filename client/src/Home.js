import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import Axios from 'axios';
import Alert from '@mui/material/Alert';
import './static/home.css';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';

export default function Home () {
    const [joueurs] = useState([]);
    const [nbJoueur, setNbJoueur] = useState(2);
    const [error, setError] = useState(false);
    const [errorPlayers, setErrorPlayers] = useState(false);
    const [db , setDb] = useState("");
    const [gameId, setGameId] = useState("");

    const navigate = useNavigate();

    // gestion de l'input du nombre de joueurs de la partie
    const handleChangeNbOfPlayers = (e) => {
        const nombre = parseInt(e.target.value, 10);
        setNbJoueur(nombre);
        // console.log(nombre);
        // console.log(error);
        if (nombre > 4 || nombre < 2) {
            setError(true);
        } else {
            setError(false);
        }
    };

    // listener de modification des inputs de pseudos de joueurs
    const handleChangeNomJoueur = (e, index) => {
        const nom = e.target.value;
        joueurs[index] = nom;
        console.log(joueurs);
    };

    // Méthode d'écoute de l'alerte afin de la désactiver
    const handleCloseAlert = () => {
        setErrorPlayers(false);
    };

    const handleKeyPressed = (e) => {
        if (e.key === 'Enter'){
            launchParty();
        }
    }
 
    // Méthode d'accession à la partie de jeu
    const launchParty = async() => {
        if (estUnique(joueurs) && !checkTableau(joueurs)) {
            if (db === "") {
                setDb("empty");
            } 
            // Insertion en base de la partie et des joueurs
            joueurs.forEach(joueur => {
                Axios.post(`http://localhost:3001/api/${db}/createPlayer`, {nom: joueur});
            })
            Axios.post(`http://localhost:3001/api/${db}/createGame`, {
                nbJoueurs: joueurs.length,
                createTime: new Date().toLocaleString(),
            }).then(async (res) => {
                console.log(res.data); // Affichage de l'ID de la partie
            });
            
            navigate("/game", {state: {joueurs : joueurs, db : db, gameId : gameId}});
        } else {
            setErrorPlayers(true);
        }
    };

    const changeGameId = async (id) => {
        setGameId(await id);
    }

    return (
        <div className="home" onKeyDown={(e) => handleKeyPressed(e)}>
            <h3>Bienvenue</h3>
            <h5>Choisissez le nb de joueurs : </h5>
            <input type="number" className="nbJoueur" value={nbJoueur} min="2" max="4" onChange={handleChangeNbOfPlayers}></input>
            {error ? <Alert severity="warning">Il doit y avoir entre 2 et 4 joueurs.</Alert> : ""}
            {error ? "" :
                <div>
                    {Array.from({ length: nbJoueur }, (_, index) => (
                        <div key={index}>
                            <label>{`Joueur ${index + 1}: `}</label>
                            <input type="text" onChange={(e) => handleChangeNomJoueur(e, index)} placeholder={`Entrez le pseudo n° ${index + 1}`}/>
                        </div>
                    ))}
                </div>
            }
           <button {...(error ? {disabled: true} : {})} onClick={launchParty}>Jouer</button>
           <button onClick={() => navigate("/generate-games")}>Génération de parties</button>

           {/* --------------- Ajout de la pop up de choix de bdd ----------------------- */} 
           {db !== "" ? <Alert severity="success">Base de données sélectionnée : {db}</Alert> : <Alert severity="warning">Veuillez sélectionner une base de données pour lancer le jeu.</Alert>}
           <Popup
                trigger={<a className="button"> Choix de la base </a>}
                modal
                nested
            >
                {close => (
                <div className="modal">
                    <div className="content">
                        {' Choisissez la base de données :'}
                        <select className='select' onChange={e => setDb(e.target.value)}  name={'db'}>
                            <option value={'empty'}>3 options :</option>
                            <option value={'mysql'}>MySQL</option>
                            <option value={'mongodb'}>MongoDB</option>
                            <option value={'sqlite'}>SQLite</option>
                        </select>
                    </div>
                    <div className="actions">
                        <button className="button"
                            onClick={() => {
                                console.log(db);
                                Axios.post('http://localhost:3001/dbChoice', {selectedDatabase: db});
                                console.log('bdd validée');
                                close();
                            }}
                        >
                            Valider
                        </button>
                    </div>
                </div>
                )}
            </Popup>
           <Snackbar open={errorPlayers} autoHideDuration={4000} onClose={handleCloseAlert} message="Les noms des joueurs doivent être uniques et/ou renseignés."/>
        </div>
    )
}

// Fonction vérifiant que les pseudos dans le tableau sont uniques
function estUnique (tableau) {
    const set = new Set();
    for (let i = 0; i < tableau.length; i++) {
      if (set.has(tableau[i])) {
        return false;
      }
      set.add(tableau[i]);
    }
    return true;
};

// Fonction vérifiant que le tableau joueur ne contient pas de valeur vide / n'est pas vide
function checkTableau (tableau) {
    let check = false;
    if (tableau.length < 2 || tableau.length > 4 ) {
        console.log("check 1")
        check = true;
    }
    for (let i = 0; i < tableau.length; i++) {
        if (tableau[i] === '' || tableau[i] === undefined){
            console.log("check 2")
            console.log(tableau[i] === '' || tableau[i] === 'empty')
            check = true;
        }
        
    }
    return check
}