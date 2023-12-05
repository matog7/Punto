CREATE TABLE If not exists Game(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    nbPlayers int NOT NULL COMMENT 'Number of players',
    create_time VARCHAR(255) COMMENT 'Creation time'
) COMMENT 'Game table';

CREATE TABLE IF NOT EXISTS Player (
    name VARCHAR(255) PRIMARY KEY NOT NULL COMMENT 'Player name, primary key',
    roundWon INT NOT NULL COMMENT "Player's round(s) won",
    gameWon INT NOT NULL COMMENT "Player's game(s) won"
) COMMENT 'Player table';

CREATE TABLE IF NOT EXISTS Movements (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary key',
    game_id INT NOT NULL COMMENT 'Foreign key to Game table',
    FOREIGN KEY (game_id) REFERENCES Game(id),
    player_name VARCHAR(255) NOT NULL COMMENT 'Foreign key to Player table',
    FOREIGN KEY (player_name) REFERENCES Player(name),
    roundNumber INT NOT NULL COMMENT 'Round number',
    placement VARCHAR(255) COMMENT 'Placement',
    value INT COMMENT 'Value',
    color VARCHAR(255) COMMENT 'Color',
    roundTime VARCHAR(255) COMMENT 'Round time'
) COMMENT 'Round table';

CREATE TABLE IF NOT EXISTS GamePlayed (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary key',
    game_id INT NOT NULL COMMENT 'Foreign key to Game table',
    FOREIGN KEY (game_id) REFERENCES Game(id),
    winner VARCHAR(255) COMMENT 'Winner of the game'
) COMMENT 'Round table';

DROP TABLE IF EXISTS Movements;
DROP TABLE IF EXISTS GamePlayed;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Player;
```
