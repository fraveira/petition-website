-- Creating table for the users. 

DROP TABLE IF EXISTS users
CASCADE;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL,
    last VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL

);

DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles
(
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR,
    url VARCHAR,
    user_id INT REFERENCES users(id) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS petition;

CREATE TABLE petition
(
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL,
    user_id INT REFERENCES users(id) NOT NULL
);
