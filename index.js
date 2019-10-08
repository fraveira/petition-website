const db = require('./db');
const express = require('express');
const app = express();
const hb = require('express-handlebars');
const cookieSession = require('cookie-session');
const csurf = app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

// Static:

app.use(express.static('./public'));

// MIDDLEWARE:

app.use(function(req, res, next) {
	res.set('x-frame-options', 'DENY');
	console.log('Time, Middleware running! :', Date.now());
	next();
});

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
//app.use(csurf());

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
				console.log('This is the big url that represents the pic', result.rows[0]);
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
	// Make another database URL to get the cookie based on the cookie, that's based on the
});

app.get('/signers', (req, res) => {
	db
		.getSupporters()
		.then((result) => {
			console.log('This is the result', result);
			res.render('signers', {
				layout: 'main',
				signers: result.rows // Renders template "signers"
			});
		})
		.catch((err) => {
			console.log('error happened', err);
		});
});

app.get('/test', (req, res) => {
	req.session.sigId = 10;
	console.log('req.session in /test before redirect: ', req.session);
	res.redirect('/'); // DELETE THIS AFTER THE CLASS IS OVER.
});

app.get('*', (req, res) => {
	req.session.cohort = 'coriander';
	res.redirect('/');
});

app.listen(8080, () => console.log('Petition Server running succesfully'));
