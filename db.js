const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/petition`
);

module.exports.createSupport = (signature, user_id) => {
    return db.query(
        `INSERT INTO petition (signature, user_id) values ($1, $2) RETURNING id;`,
        [signature, user_id]
    );
};

module.exports.getSupporters = () => {
    // return db.query(`SELECT first, last FROM users`); // join will do this. We need to select the users that have a signature
    return db.query(
        `SELECT first, last, age, city, url FROM petition LEFT JOIN users ON users.id = petition.user_id LEFT JOIN user_profiles ON users.id = user_profiles.user_id`
    );
};

module.exports.getNrOfSigners = () => {
    return db.query(`SELECT COUNT(*) FROM petition`);
};

module.exports.checkSoloSignature = id => {
    return db.query(`SELECT user_id FROM petition WHERE user_id = $1 `, [id]);
};

module.exports.getSoloSignature = id => {
    return db.query(
        `SELECT signature, first FROM petition LEFT JOIN users ON users.id = petition.user_id WHERE user_id = $1`,
        [id]
    );
};

module.exports.registeringUsers = (first_name, last_name, email, hash) => {
    return db.query(
        `INSERT INTO users (first, last, email, password) values ($1, $2, $3, $4) RETURNING id;`,
        [first_name, last_name, email, hash]
    );
};

module.exports.retrievingPassword = email => {
    return db.query(`SELECT password FROM users WHERE email = $1`, [email]);
};

module.exports.loggedId = email => {
    return db.query(`SELECT id FROM users WHERE email = $1`, [email]);
};

module.exports.creatingProfile = (age, city, url, user_id) => {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id) values ($1, $2, $3, $4) RETURNING id`,
        [age || null, city, url, user_id]
    );
};

module.exports.getSignersByCity = city => {
    return db.query(
        `SELECT first, last, age, city, url FROM petition LEFT JOIN users ON users.id = petition.user_id LEFT JOIN user_profiles ON users.id = user_profiles.user_id WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
};

module.exports.displayProfile = user_id => {
    return db.query(
        `
    SELECT first, last, email, age, city, url
    FROM users
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    WHERE users.id = $1
    `,
        [user_id]
    );
};

module.exports.editUsersInfo = (first, last, email, user_id) => {
    return db.query(
        `
        UPDATE users SET first = $1, last = $2, email = $3
        WHERE id = $4
        `,
        [first, last, email, user_id]
    );
};

module.exports.editUsersProfile = (age, city, url, user_id) => {
    return db.query(
        `
        INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET age = $1, city = $2, url = $3
        `,
        [age || null, city || null, url || null, user_id] // Age same as creatingProfile.
    );
};

module.exports.editPasswordPlusOthers = (
    first,
    last,
    email,
    password,
    user_id
) => {
    return db.query(
        `
        UPDATE users SET first = $1, last = $2, email = $3, password = $4
        WHERE id =$5
        `,
        [first, last, email, password, user_id]
    );
};

module.exports.deleteSignature = id => {
    return db.query(`DELETE FROM petition WHERE user_id = $1`, [id]);
};
