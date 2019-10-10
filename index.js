const db = require('./db');
const express = require('express');
const app = express();
const hb = require('express-handlebars');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const bcrypt = require('./bcrypt');

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

// Static:

app.use(express.static('./public'));

// MIDDLEWARE:

app.use(
	cookieSession({
		secret: `I'm always happy.`,
		maxAge: 1000 * 60 * 60 * 24 * 14
	})
);

app.use(
	express.urlencoded({
		extended: false
	})
);

app.use(csurf());

app.use(function(req, res, next) {
	res.set('x-frame-options', 'DENY');
	res.locals.csrfToken = req.csrfToken();
	console.log('Middleware running!');
	next();
});

// ROUTES:

app.get('/', (req, res) => {
	// If user logged in, then take them to /thanks.
	res.redirect('/register');
});

// PETITION ROUTES

app.get('/petition', (req, res) => {
	if (req.session.signatureId) {
		res.redirect('/thanks');
	} else if (req.session.userId) {
		db
			.checkSoloSignature(req.session.userId)
			.then(({ rows }) => {
				if (rows[0]) {
					res.redirect('/thanks');
				} else {
					res.render('petition');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	} else {
		res.redirect('/register');
	}
});

app.post('/petition', (req, res) => {
	let signature = req.body.signature;
	db
		.createSupport(signature, req.session.userId) // add user-id here?
		.then((result) => {
			req.session.signatureId = result.rows[0].id; // To be written
			res.redirect('/thanks');
		})
		.catch((err) => {
			console.log('error happened', err);
		});
});

app.get('/thanks', (req, res) => {
	let cookieID = req.session.userId;

	db.getNrOfSigners().then((total) => {
		return db
			.getSoloSignature(cookieID)
			.then((result) => {
				res.render('thanks', {
					layout: 'main',
					signature: result.rows[0].signature,
					nrofsigners: total.rows,
					first: result.rows[0].first
				});
			})
			.catch((err) => {
				console.log('error happened', err);
			});
	});
});

app.get('/signers', (req, res) => {
	db
		.getSupporters()
		.then((result) => {
			res.render('signers', {
				layout: 'main',
				signers: result.rows // Renders template "signers"
			});
		})
		.catch((err) => {
			console.log('error happened', err);
		});
});

app.get('/signers/:city', (req, res) => {
	console.log(req.params.city);
	let city = req.params.city;
	db
		.getSignersByCity(city)
		.then((city) => {
			res.render('signers', {
				layout: 'main',
				signers: city.rows // Renders template "signers"
			});
		})
		.catch((err) => {
			console.log('error happened', err);
		});
});

// Register routes:

app.get('/register', (req, res) => {
	res.render('registration');
});

app.post('/register', (req, res) => {
	console.log(req.body.email);
	console.log(req.body.password);
	let first_name = req.body.first_name;
	let last_name = req.body.last_name;
	let email = req.body.email;
	let password = req.body.password;

	bcrypt.hash(password).then((hash) => {
		db
			.registeringUsers(first_name, last_name, email, hash)
			.then(({ rows }) => {
				req.session.userId = rows[0].id;
				res.redirect('/profile'); // BEFORE, THIS WAS REDIRECTING TO /petition.
			})
			.catch((err) => {
				console.log('error happened', err);
			});
	});
});

// Login routes

app.get('/login', (req, res) => {
	if (req.session.userId) {
		return res.redirect('/petition');
	}
	res.render('login', {
		layout: 'main'
	});
});

app.post('/login', (req, res) => {
	let email = req.body.email;
	let submittedPass = req.body.password;
	let userPassword;
	db
		.retrievingPassword(email)
		.then(({ rows }) => {
			userPassword = rows[0].password;
			return userPassword;
		})
		.then((userPassword) => {
			return bcrypt.compare(submittedPass, userPassword); // compares given password and existing password.
		})
		.then((areTheSame) => {
			if (areTheSame) {
				db.loggedId(email).then((id) => {
					req.session.userId = id.rows[0].id;
					return res.redirect('/petition');
				});
			} else {
				return res.render('login', { error: true });
			}
		})
		.catch((error) => {
			console.log(error);
			return res.render('login', { error: true });
		});
});

// Profile routes

app.get('/profile', function(req, res) {
	res.render('profile', {
		layout: 'main'
	});
});

app.post('/profile', function(req, res) {
	let age = req.body.age;
	let city = req.body.city;
	let url = req.body.url;
	let user_id = req.session.userId;
	if (age != '' || city != '' || url != '') {
		db.creatingProfile(age, city, url, user_id).then((id) => {
			req.session.profileId = id.rows[0].id;
			res.redirect('/petition');
		});
	} else {
		res.redirect('/petition'); // In any case (DB query mediante or not), when CONTINUE is clicked, they can come here.
	}
});

// Logout final route.

app.get('/logout', function(req, res) {
	req.session.userId = null;
	res.redirect('/register');
});

app.listen(process.env.PORT || 8080, () => console.log('Petition Server running succesfully'));
