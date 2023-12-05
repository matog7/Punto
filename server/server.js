const Express = require('express'); // Express web server framework
const App = Express();
const bodyParser = require('body-parser'); // npm install body-parser
const cors = require('cors'); // npm install cors 
const fileUpload = require('express-fileupload'); // npm install express-fileupload 

// importe les fichiers de configuration des routes
const controllerSql = require('./configSql');
const controllerMongo = require('./configMongo'); 
const controllerSqlite = require('./configSqlite');

// instanciation des middlewares (fonctions qui s'exécutent avant les routes)
App.use(bodyParser.urlencoded({extended: true})); // permet de récupèrer les donnnées passées en requête d'une méthode POST
App.use(Express.json()); // permet de parser les données reçues en JSON pour ensuite bien les traiter
App.use(cors()); // permet d'autoriser les requêtes cross-origin

// endpoint pour le choix de la base de données
App.post('/dbChoice', (req, res) => {
    const selectedDatabase = req.body.selectedDatabase;
    console.log('Base de données sélectionnée : ', selectedDatabase);
  
    // Ici, on utilise le fichier de configuration des routes correspondant à la base de données sélectionnée
    if (selectedDatabase === 'mysql') {
        App.use('/api/', controllerSql); 
    } else if (selectedDatabase === 'mongodb') {
        App.use('/api/', controllerMongo);
    } else if (selectedDatabase === 'sqlite') {
        App.use('/api/', controllerSqlite);
    }
    res.json({ message: 'Jeu lancé avec succès !' });
});

// lance le serveur sur le port 3001
App.listen(3001, () => {
    console.log("API is running on port 3001...");
});