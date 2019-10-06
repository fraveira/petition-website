DROP TABLE IF EXISTS petition;

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