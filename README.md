# Punto
Application du Jeu du Punto en ReactJs

# Installation : 

Placez vous dans le dossier client et faîtes 'npm i'. Faites ensuite la même chose dans le dossier server.

Ensuite, utilisez les scripts côté server afin de créer les bases de données. 

Afin de lancer le jeu, lancer 2 terminaux, un côté server et un autre côté client, et exécitez la commande 'npm start' afin de lancer le server et le client React.

Enfin, si vous souhaitez transférer les données d'une base à une autre, référez vous à la partie de ce README traitant du sujet. 

Voilà, je vous laisse profiter du jeu.

# Partie client

## Fonctionnalités :
- Page d'accueil : Sélection du nombre de joueurs, de leurs pseudos et de la base de données à utiliser.
- Page de génération de partie : entrée du nombre de joueurs et du nombre de parties à générer, sélection de la base de données cible. 
- Page de jeu : comprenant tout le système de tour, d'affichage du plateau et de la carte du joueur et la logique de victoire de manche ainsi que de partie.
- Page de victoire, reportant le joueur gagnant de la partie et permettant de rejouer.

# Partie server 

## Fonctionnalités :
- Insertion des Parties, Joueurs, Parties jouées, et coups joués
- Mise à jour du score d'un joueur (ses manches gagnées et ses parties gagnées en fin de partie)
- Mise à jour Partie jouée afin de spécifier le gagnant (initialisé à null en début de partie)
- Lien entre Partie et Partie jouée géré de ce côté, c'est à dire que directement après l'insertion d'une Partie, on récupère son id, on le stocke, et on l'utilise tout au long de la partie en cours afin de créer les liens.
 

## EndPoints :
Les APIs possèdent différents endpoints, tous sous la forme [/api/dbSelected/endpoint] (cf screen config)

## Migrations :
Positionnez vous dans le dossier migrations côté server et exécuter la commande 'node [nomdufichier].js' en entrant le nom de la migration que vous voulez effectuer.

Migrations disponibles : \\
- MySQL -> MongoDB
- MongoDB -> MySQL
- SQLite -> MySQL
- MySQL -> SQLite