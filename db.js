const spicedPg = require('spiced-pg');
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/petition`);

// Username, password
module.exports.createSupport = (first, last) => {
	return db.query(`INSERT INTO petition (first, last) values ($1, $2);`, [ first, last ]);
};
// module.exports.getSignatures = (id, first, last, signature) => {
// 	return db.query(
// 		`SELECT * FROM cities
//         WHERE name = $1 AND country = $2`,
// 		[ name, country ]
// 	);
// };

// db
// 	.query(
// 		`INSERT INTO cities (city, country)
// VALUES ('Glasgow', 'United Kingdom')
// RETURNING *`
// 	)
// 	.then(({ rows }) => console.log(result))
// 	.catch((err) => console.log(err.message));
