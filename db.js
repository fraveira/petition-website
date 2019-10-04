const spicedPg = require('spiced-pg');
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/petition`);
// Username, password

module.exports.getCityByName = (name) => {
	return db.query(
		`SELECT * FROM cities 
        WHERE name = $1 AND country = $2`,
		[ name, country ]
	);
};

// db
// 	.query(
// 		`INSERT INTO cities (city, country)
// VALUES ('Glasgow', 'United Kingdom')
// RETURNING *`
// 	)
// 	.then(({ rows }) => console.log(result))
// 	.catch((err) => console.log(err.message));
