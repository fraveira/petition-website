const spicedPg = require('spiced-pg');
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/petition`);

module.exports.createSupport = (first, last, signature) => {
	return db.query(`INSERT INTO petition (first, last, signature) values ($1, $2, $3) RETURNING id;`, [
		first,
		last,
		signature
	]);
};

module.exports.getSupporters = () => {
	return db.query(`SELECT first, last FROM petition`);
};

module.exports.getNrOfSigners = () => {
	return db.query(`SELECT COUNT(*) FROM petition`);
};

module.exports.getSoloSignature = (id) => {
	return db.query(`SELECT signature FROM petition WHERE ID = $1 `, [ id ]);
};
