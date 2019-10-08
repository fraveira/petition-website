const db = require('./db');
const express = require('express');
const app = express();
const hb = require('express-handlebars');
const cookieSession = require('cookie-session');
const csurf = require('csurf');

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
// This goes
app.use(csurf());

app.use(function(req, res, next) {
	res.set('x-frame-options', 'DENY');
	res.locals.csrfToken = req.csrfToken();
	console.log('Middleware running!');
	next();
});

// ROUTES:

app.get('/', (req, res) => {
	console.log('req.session in / route: ', req.session);
	res.redirect('/petition');
});

app.get('/petition', (req, res) => {
	if (req.session.signatureId) {
		res.redirect('/thanks');
	} else {
		res.render('petition');
	}
});

app.post('/petition', (req, res) => {
	console.log(req.body.first);
	console.log(req.body.last);
	console.log(req.body.signature);
	console.log(req.body.id);
	let first = req.body.first;
	let last = req.body.last;
	let signature = req.body.signature;
	db
		.createSupport(first, last, signature)
		.then((result) => {
			req.session.signatureId = result.rows[0].id; // To be written
			res.redirect('/thanks');
		})
		.catch((err) => {
			console.log('error happened', err);
		});
});

app.get('/thanks', (req, res) => {
	console.log(req.session.signatureId);
	let cookieID = req.session.signatureId;

	db.getNrOfSigners().then((total) => {
		return db
			.getSoloSignature(cookieID)
			.then((result) => {
				res.render('thanks', {
					layout: 'main',
					signature: result.rows[0].signature,
					nrofsigners: total.rows
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

app.listen(8080, () => console.log('Petition Server running succesfully'));
