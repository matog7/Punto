import react from 'react';
import Alert from '@mui/material/Alert';
import Helmet from 'react-helmet';
import '../static/punto.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';

function Square({ key, index, value, color, handleClick, clickable }) {
  // renvoie l'index du carré cliqué au parent, afin de mettre à jour sa valeur
  const handleSquareClick = () => {
    if (clickable){
      handleClick(index);
    } else {
      <Alert severity="warning">Il doit y avoir entre 2 et 4 joueurs.</Alert>
    }
  };
  const className = clickable ? "square-clickable" : "square-not-clickable"
  return(
    <div className={className} id={color} onClick={handleSquareClick}>
      <p>{value}</p> 
    </div>
  );
}

function Card({value, color}) {
  const [isHidden, setIsHidden] = useState(false);

  const handleClick = () => {
    setIsHidden(!isHidden); // Inverser l'état actuel de la carte
  };

  return (
    <div className="card-content">
      <div className="card" id={color} onClick={handleClick}>
        {isHidden ? value : 'Punto'}
      </div>
    </div>
  );
}

function Board({ squares, tourDeJeu, isFirstPlay, won}) {
  const [boardSquares, setBoardSquares] = useState(squares);

  const handleSquareClick = (index) => {
    console.log("j'ai cliqué sur le carré : ", index);
    tourDeJeu(index);
  }

  useEffect(() => {
    // Mettre à jour les carrés du board lorsqu'il y a un changement dans squares
    setBoardSquares(squares);
  }, [squares]);

  const calcul6par6 = (squares) => {
    const unplayable = [];
    const lineDisabled = [];
    const colDisabled = [];
    // je repasse en matrice 
    const board = [];
    for (let i = 0; i < 11; i++) {
      const row = [];
      for (let j = 0; j < 11; j++) {
        row.push(squares[i*11 + j])
      }
      board.push(row);
    }

    // console.log("matrice ", board);
    for(let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
        if (board[i][j] !== 0 ) {
          if (j > 5) {
            colDisabled.push(j-6);
          } else {
            colDisabled.push(j+6);
          }
          if (i > 5) {
            lineDisabled.push(i-6);
          } else {
            lineDisabled.push(i+6);
          }
        }
      }
    }
    unplayable.push(colDisabled)
    unplayable.push(lineDisabled)
    return unplayable;
  }
  const unplayable = calcul6par6(boardSquares);

  // Créez un tableau pour générer les carrés dans une grille de 11x11
  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < 11; i++) {
      const row = [];
      for (let j = 0; j < 11; j++) {
        const index = i * 11 + j;
        const squareValue = boardSquares[index];
        let verifLigne;
        let verifCol;
        let verifDiag;
        // console.log(boardSquares)
        if (!won && boardSquares[index] !== undefined){
          if (index+12 < 120){
            verifLigne =  boardSquares[index +11][0] !== undefined;
            verifCol = boardSquares[index +1][0] !== undefined;
            verifDiag = (boardSquares[index +10][0] !== undefined || boardSquares[index +12][0] !== undefined);
          }

          if (index - 10 > 0){
            verifCol = verifCol || boardSquares[index -1][0] !== undefined;
            verifDiag = verifDiag ||boardSquares[index -10][0] !== undefined
          }
          if (index - 11 > 0){
            verifLigne = verifLigne || boardSquares[index -11][0] !== undefined;
          } 
          if (
            index - 12 > 0
          ){
            verifDiag = verifDiag || boardSquares[index -12][0] !== undefined
          }
      
          if (isFirstPlay) {
            if (index === 60){
              row.push(
                <Square
                  key={`square-${i}-${j}`}
                  index={`${i},${j}`}
                  value={squareValue[0]}
                  color={squareValue[1]}
                  handleClick={handleSquareClick}
                  clickable={true}
                />
              );
            } else {
              row.push(
                <Square
                  key={`square-${i}-${j}`}
                  index={`${i},${j}`}
                  value={squareValue[0]}
                  color={squareValue[1]}
                  handleClick={handleSquareClick}
                  clickable={false}
                />
              );
            }
            
          } else if (unplayable[0].includes(j) || unplayable[1].includes(i)) {
            row.push(
              <Square
                key={`square-${i}-${j}`}
                index={`${i},${j}`}
                value={squareValue[0]}
                color={squareValue[1]}
                handleClick={handleSquareClick}
                clickable={false}
              />
            );
          } else if ((verifLigne || verifCol || verifDiag) && (!unplayable[0].includes(j) || unplayable[1].includes(i))) {
            row.push(
              <Square
                key={`square-${i}-${j}`}
                index={`${i},${j}`}
                value={squareValue[0]}
                color={squareValue[1]}
                handleClick={handleSquareClick}
                clickable={true}
              />
            );
          } else {
            row.push(
              <Square
                key={`square-${i}-${j}`}
                index={`${i},${j}`}
                value={squareValue[0]}
                color={squareValue[1]}
                handleClick={handleSquareClick}
                clickable={false}
              />
            );
          }
        }
      }
      board.push(
        <div key={`row-${i}`} style={{ display: 'flex' }}>
          {row}
        </div>
      );
    }
    return board;
  };

  return <div className='board'>{renderBoard()}</div>;
}

function Game () {
  const navigate = useNavigate();
  // Récupération des joueurs et de la bdd sélectonnée
  const [joueurs, setJoueurs] = useState(useLocation().state.joueurs)
  const [db, setDb] = useState(useLocation().state.db)
  const [gameId, setGameId] = useState(useLocation().state.gameId)
  console.log("Joueurs reçus : ", joueurs, " de la bdd : ", db, " et de la partie : ", gameId);
  const [roundWon, setRoundWon] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [roundWonBy, setRoundWonBy] = useState(Array(joueurs.length).fill(0))
  const [round, setRound] = useState(1)

  // Fonction pour mettre à jour la valeur du carré sélectionné
  const [squareValue, setSquareValue] = useState(Array(121).fill(0));

  // Gestion victoire round
  useEffect(() => {
    if (roundWon) {
      console.log("round gagné par : ", joueurs[roundWonBy.indexOf(1)]);
      Axios.post(`http://localhost:3001/api/${db}/updateScore`, {
        winner: joueurs[roundWonBy.indexOf(1)],
      });
      // Réinitialisez les états pour les prochains cas de victoire
      setRoundWon(false);
      setTour(0);
      setTourEffectue(0);
      setIsFirstPlay(true);
      setSquareValue(Array(121).fill(0));
      for (let i = 0; i < joueurs.length; i++) {
        flush(cards[joueurs[i]]);
      }
      setCarteDepart(cards[joueurs[0]][0]);
      setRound(round+1);
    }
  }, [roundWon]);

  // fin de partie
  useEffect(() => {
    if (gameWon) {
      // on met à jour comme quoi il a tout de même gagné une nouvelle manche
      Axios.post(`http://localhost:3001/api/${db}/updateScore`, {
        winner: joueurs[roundWonBy.indexOf(2)],
      });
      // on met à jour le gagant de la partie
      Axios.post(`http://localhost:3001/api/${db}/updateWinner`, {
        winner: joueurs[roundWonBy.indexOf(2)],
      });
      // on met à jour le nombre de victoire du gagant de la partie
      Axios.post(`http://localhost:3001/api/${db}/updateWins`, {
        winner: joueurs[roundWonBy.indexOf(2)],
      });
      navigate("/victory", {state: {players : joueurs, winner: joueurs[roundWonBy.indexOf(2)]}});
    }
  }, [gameWon]);

  // Initialisation des variables d'état (tour, couleur neutre, première carte jouée ou pas)
  const [neutral, setNeutral] = useState('Neutre')
  const [isFirstPlay, setIsFirstPlay] = useState(true)
  const [tour, setTour] = useState(0)
  const [tourEffectue, setTourEffectue] = useState(0)

  // Génération des cartes et gestion de la carte actuelle
  const [cards, setCards] = useState(generateHand(joueurs, setNeutral));
  console.log(cards, cards[joueurs[0]][0]);
  const [carteDepart, setCarteDepart] = useState(cards[joueurs[0]][0]);
  
  const tourDeJeu = async (indexSquare) => {
    // on récupère l'index dans le tableau ce valeur correspondant à l'index du plateau
    const [row, col] = indexSquare.split(',');
    const index = parseInt(row)*11 + parseInt(col);
    // on récupère la valeur de la carte active et sa couleur
    const [value, color] = [cards[joueurs[tour]][tourEffectue].value, cards[joueurs[tour]][tourEffectue].color];
    // on change la valeur du carré concerné et la carte active
    const updatedValues = [...squareValue]; // Créer une copie de l'état actuel

    if (updatedValues[index][0] !== undefined && updatedValues[index][0] >= value) {
        alert("Vous ne pouvez pas jouer cette carte ici !")
    } else if (tour === (joueurs.length -1)) {
      // si on a atteint le dernier joueur, on revient au premier et on change le nombre de tour effectué, 
      // permettant d'accéder à la carte à laquelle on est rendu
      await changeTour(0)
      setTourEffectue(tourEffectue+1)
      setIsFirstPlay(false)
      updatedValues[index] = [value, color]; // Modifier la valeur à l'index spécifié
      console.log("valeur et index de ", indexSquare, " dans le tableau de valeur : ", index, updatedValues[index]);
      await updateSquare(updatedValues); // Mettre à jour l'état avec la nouvelle copie modifiée
      console.log("verif valeur : ", squareValue[index], " à l'index : ", index);
      const wonBy = await checkWinner();
      console.log(wonBy, "étant les rounds gagnés par chaque joueur")
      Axios.post(`http://localhost:3001/api/${db}/addMove`, {
        player: joueurs[tour],
        roundNumber: round,
        move: indexSquare, 
        value: value,
        color: color,
      });
      console.log("player", joueurs[tour], "round", round, "move", indexSquare, "value", value, "color", color);
    } else {
      console.log('test')
      // sinon on continue
      await changeTour(tour+1)
      
      setIsFirstPlay(false)
      updatedValues[index] = [value, color]; // Modifier la valeur à l'index spécifié
      console.log("valeur et index de ", indexSquare, " dans le tableau de valeur : ", index, updatedValues[index]);
      await updateSquare(updatedValues); // Mettre à jour l'état avec la nouvelle copie modifiée
      console.log("verif valeur : ", squareValue[index], " à l'index : ", index);
      const wonBy = await checkWinner();
      console.log(wonBy, "étant les rounds gagnés par chaque joueur")
      Axios.post(`http://localhost:3001/api/${db}/addMove`, {
        player: joueurs[tour],
        roundNumber: round,
        move: indexSquare, 
        value: value,
        color: color,
      });
      console.log("player", joueurs[tour], "round", round, "move", indexSquare, "value", value, "color", color);
    }
  };

  const changeTour = async(tour) => {
    console.log("passage au joueur suivant : ", joueurs[tour]);
    setTour(tour);
  }

  const updateSquare = async(updatedValues) => {
    setSquareValue(updatedValues);
  }

  const checkWinner = async() => {
    const matrix = convertToMatrix(squareValue);
    const [isWon, message, color] = checkSeries(matrix, joueurs.length);
    let copie;
    if (isWon) {
      copie = await checkColoWinner(color);
      setRoundWon(true);
      alert(message);
    }

    return copie
  }

  const checkColoWinner = async(color) => {
    const copie = [...roundWonBy];
    let joueur
    let pos

    if (tour - 1 === -1) {
      joueur = joueurs[joueurs.length-1];
      pos = joueurs.length-1;
    } else {
      joueur = joueurs[tour-1];
      pos = tour-1;
    }

    console.log('joueur gagnant : ', joueur, ' et couleur : ', color, ' et cartes : ', cards[joueur]);

    for (const card of cards[joueur]) {
      console.log("coucou", card.color, color)
      if (card.color === color) {
        copie[pos] = copie[pos] + 1;
        console.log("round won", copie[pos]);
        await updateRoundWonBy(copie);
        if (copie[pos] === 2) {
          setGameWon(true);
        }
        break;
      }
    }
    
    return copie;
  }

  const updateRoundWonBy = async function (copie) {
    setRoundWonBy(copie);
  }

  return (
    <div className="game">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Punto - Jeu en cours</title>
      </Helmet>
      <div className="game-board">
        <Board squares={squareValue} tourDeJeu={tourDeJeu} isFirstPlay={isFirstPlay} won={roundWon}/>
      </div>
      { roundWon ? "Bravo !" :
        <div className="game-info">
          <div>C'est au tour de : {joueurs[tour]}</div>
          {neutral === 'Neutre' ? "":<div>Couleur neutre : {neutral}</div>}
          <div>Cartes restantes : {(cards[joueurs[tour]].length - tourEffectue)}</div>
          <div className='carteAJouer'>
            { isFirstPlay ?
              <Card value={carteDepart.value} color={carteDepart.color}></Card>
              :
              <Card value={cards[joueurs[tour]][tourEffectue].value} color={cards[joueurs[tour]][tourEffectue].color}></Card>
            }
          </div>
        </div>
      }
    </div>
  );
}


// Fonctions utiles à la function react Jeu
const generateHand = (joueurs) => {
  // Génération des couleurs et des séries
  const series = Array.from({ length: 9 }, (_, i) => i + 1); // Séries de 1 à 9
  let chiffre = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9]; // 18 chiffres
  const nbJoueurs = joueurs.length;

  // Jeu entier
  const cartesJeu = {}

  // Génération du jeu de cartes pour chaque joueurs
  let mainJoueur = [];
  let neutral = '';

  // Attribution des couleurs 
  const playersColors = []
  let couleurs = ['Rouge', 'Vert', 'Bleu', 'Jaune']; // 4 couleurs
  switch (nbJoueurs) {
    case 2: 
    const colors1 = [];
    const colors2 = [];
    let i = 0;
      while (couleurs.length > 0){
        const aleatoire = Math.floor(Math.random() * couleurs.length);
        const couleur = couleurs[aleatoire];
        couleurs = couleurs.filter((valeur) => valeur !== couleur);
        if (i < 2){
          colors1.push(couleur);
        } else {
          colors2.push(couleur);
        }
        i++;
      }
      playersColors.push(colors1);
      playersColors.push(colors2);
      console.log("couleurs à la génération: ", playersColors)
      break;
    case 4:
      flush(couleurs);
      break;
    case 3: 
      // dans le cas de 3 joueurs, la carte à la fin du tableau mélangé sera la couleur neutre
      flush(couleurs);
      const aleatoire = Math.floor(Math.random() * couleurs.length);
      const neutre = couleurs[aleatoire];
      couleurs = couleurs.filter((valeur) => valeur !== neutre);
      couleurs.forEach(value => {
        playersColors.push([value]);
      });
      // setNeutral(neutre);
      neutral = neutre;
      break;
    default:
      break;
  }
  // const tests = []
  for (let i = 0; i < nbJoueurs; i++) {
    const passageCouleur = [''];
    if (nbJoueurs === 2) {
      mainJoueur = generateCards(playersColors[i], nbJoueurs);
    } else if (nbJoueurs === 4) {
      passageCouleur[0] = couleurs[i];
      mainJoueur = generateCards(passageCouleur, nbJoueurs);
    } else {
      mainJoueur = generateCards(playersColors[i], nbJoueurs, chiffre);
    }
    cartesJeu[joueurs[i]] = mainJoueur;
    // console.log("jeu : ", cartesJeu)
    // console.log("cartes ", neutral, " distribuées : ", tests)
  }

  // Fonction afin de générer les cartes d'un joueur 
  // @param colors : la / les couleurs qui lui sont attribuées
  // @return cards : les cartes pour ce joueur
  function generateCards (colors, nbPlayers) {
    // console.log(colors);
    const cards = [];
    for (let i = 0; i < colors.length; i++) {
      for (let j = 0; j < 2; j++) { // Effectuer deux tours sur series
        series.forEach(value => {
          cards.push({ value, color: colors[i] });
        });
      }
      // console.log("cartes générées : ", cards);
    }
    if (nbPlayers === 3 && chiffre !== undefined){
      const carteNeutre = [];
      while (carteNeutre.length < 6) {
        const aleatoire = Math.floor(Math.random() * chiffre.length);
        const value = chiffre[aleatoire];
        const indexToRemove = chiffre.indexOf(value); // Trouver l'indice de la première occurrence de 1
        chiffre.splice(indexToRemove, 1);
        carteNeutre.push(value)
        // tests.push(value)
      }
      carteNeutre.forEach(value => {
        cards.push({value, color : neutral})    
      });    
    }
    flush(cards)
    return cards;
  }
  return cartesJeu;

}

// --- Fonctions utiles au jeu ---

// Fonction de Mélange (par exemple, utilisation de l'algorithme Fisher-Yates)
function flush(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

// fonction de conversion du tableau de valeurs des carrésc en matrice
function convertToMatrix(arr) {
  const matrix = [];
  while (arr.length) {
      matrix.push(arr.splice(0, 11));
  }
  return matrix;
}

// fonction de vérification des séries, afin de déterminer le gagnant
function checkSeries(matrix, numPlayers) {
  const rows = matrix;
  const cols = transposeMatrix(matrix);
  const diagonals = getAllDiagonals(matrix);

  const seriesToCheck = [...rows, ...cols, ...diagonals];

  const targetLength = numPlayers === 2 ? 5 : 4; // Longueur cible en fonction du nombre de joueurs

  let series = {} // afin de stocker les séries de chaque joueur

  for (const series of seriesToCheck) {
      let count = 1;
      let currentColor = null;

      for (const card of series) {
          const [value, color] = card || [null, null];

          if (color === currentColor && color !== null) {
              count++;
          } else {
              count = 1;
              currentColor = color;
          }

          if (count === targetLength) {
              return [true, `${currentColor} a gagné !`, currentColor]; // Si une série de bonne longueur est trouvée, on renvoie le gagnant
          }
      }
  }

  return [false, "Pas de gagnant encore !", null]; // Si aucune série n'est trouvée
}

// Fonction de transposition de la matrice, afin de récupérer les colonnes
function transposeMatrix(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

// Fonction de récupération des diagonales
function getAllDiagonals(matrix) {
  const diagonals = [];
  const maxLength = matrix.length;

  for (let i = 0; i < 2 * maxLength - 1; i++) {
      const diagonal = [];
      for (let j = Math.max(0, i - maxLength + 1); j <= Math.min(i, maxLength - 1); j++) {
          diagonal.push(matrix[j][i - j]);
      }
      diagonals.push(diagonal);
  }

  return diagonals;
}

export default Game