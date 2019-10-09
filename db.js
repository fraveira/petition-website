const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || `postgres:postgres:postgres@localhost:5432/petition`);

module.exports.createSupport = (signature, user_id) => {
	return db.query(`INSERT INTO petition (signature, user_id) values ($1, $2) RETURNING id;`, [ signature, user_id ]);
};

module.exports.getSupporters = () => {
	// return db.query(`SELECT first, last FROM users`); // join will do this. We need to select the users that have a signature
	return db.query(`SELECT first, last FROM petition LEFT JOIN users ON users.id = user_id`);
};

module.exports.getNrOfSigners = () => {
	return db.query(`SELECT COUNT(*) FROM petition`);
};

module.exports.checkSoloSignature = (id) => {
	return db.query(`SELECT user_id FROM petition WHERE user_id = $1 `, [ id ]);
};

module.exports.getSoloSignature = (id) => {
	return db.query(
		`SELECT signature, first FROM petition LEFT JOIN users ON users.id = petition.user_id WHERE user_id = $1`,
		[ id ]
	);
};

module.exports.registeringUsers = (first_name, last_name, email, hash) => {
	return db.query(`INSERT INTO users (first, last, email, password) values ($1, $2, $3, $4) RETURNING id;`, [
		first_name,
		last_name,
		email,
		hash
	]);
};

module.exports.retrievingPassword = (email) => {
	return db.query('SELECT password FROM users WHERE email = $1', [ email ]);
};

module.exports.loggedId = (email) => {
	return db.query('SELECT id FROM users WHERE email = $1', [ email ]);
};
