/**
 * Script de connexion à la base de données 
*/

const mysql = require('mysql2'); // npm install mysql2 -> pour les requêtes SQL

// on récupère notre connexion par défaut à la bdd, cela va permettre de faire des requêtes sur la bdd
const db = mysql.createPool({
    host: 'localhost',
    user: 'matog',
    password: 'matog',
    database: 'punto_game'
});

module.exports = {db};