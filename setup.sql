-- DROP TABLE IF EXISTS petition; Not dropping anymore. 

CREATE TABLE petition
(
    id SERIAL PRIMARY KEY,
    first VARCHAR(200) NOT NULL CHECK (first != ''),
    last VARCHAR(200) NOT NULL CHECK (first != ''),
    signature TEXT NOT NULL
);

INSERT INTO petition
    (first, last, signature)
VALUES
    ('Paco', 'Pepe', 4535345345);
INSERT INTO petition
    (first, last, signature)
VALUES
    ('Francisco', 'José', 543543534);

SELECT *
FROM petition

-- Creating table for the users. 

DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL,
    last VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL

);

INSERT INTO users
    (first, last, email, password)
VALUES
    ('Bill', 'Gates', 'america@isonline.usa', '1234');
INSERT INTO users
    (first, last, email, password)
VALUES
    ('Mama', 'Cass', 'a@aol.com', '1234');

SELECT *
FROM petition
