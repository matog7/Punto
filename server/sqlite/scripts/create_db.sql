

DROP TABLE IF EXISTS Movements;
DROP TABLE IF EXISTS GamePlayed;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Player;

CREATE TABLE IF NOT EXISTS Game (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    nbPlayers INTEGER NOT NULL,
    create_time DATETIME
);

CREATE TABLE IF NOT EXISTS Player (
    name VARCHAR(255) PRIMARY KEY NOT NULL,
    roundWon INTEGER NOT NULL,
    gameWon INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    player_name TEXT NOT NULL,
    roundNumber INTEGER NOT NULL,
    placement TEXT,
    value INTEGER,
    color TEXT,
    roundTime TEXT,
    FOREIGN KEY (player_name) REFERENCES Player(name),
    FOREIGN KEY (game_id) REFERENCES Game(id)
);

CREATE TABLE IF NOT EXISTS GamePlayed (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    game_id INTEGER NOT NULL,
    winner VARCHAR(255),
    FOREIGN KEY (game_id) REFERENCES Game(id)
);
