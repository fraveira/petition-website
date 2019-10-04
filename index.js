const db = require('./db');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const hb = require('express-handlebars');

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

// Static:

app.use(express.static('./public'));

// MIDDLEWARE:

app.use(function(req, res, next) {
	console.log('Time, Middleware running! :', Date.now());
	next();
});

// ROUTES:

app.get('/', (req, res) => {
	res.redirect('/petition');
	// res.render("petition");
});

app.get('/petition', (req, res) => {
	res.render('petition');
});

app.post('/petition', (req, res) => {
	console.log('req.body is: ', req.body);
	// To be written
	//        -if the "INSERT" is successful, redirect to thanks page
	//        -if the "INSERT" fails, render form with error message
	res.sendStatus(404);
	//res.render('petition', { error: true });
});

app.get('/thanks', (req, res) => {
	res.render('thanks');
});

app.get('/signers', (req, res) => {
	res.render('signers');
});

app.listen(8080, () => console.log('Petition Server running succesfully'));
