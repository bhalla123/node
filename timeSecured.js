const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const router = require('router');
const flash = require('connect-flash');
const session = require('express-session');
const cookiesParser = require('cookie-parser');
var fileupload = require("express-fileupload");
const passport = require('passport');

const port = process.env.PORT || 3003
const app = express();

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({type: 'application/*'}));
//app.use(bodyParser.json({ type: 'application/*+json' }));

app.use(bodyParser.urlencoded({ extended: true }));

// Express session (milliseconds)
app.use(  session({ secret: 'timeSecuredSecret', cookie: { maxAge: 3600000 }, resave: true, saveUninitialized: true}) );

app.use(cookiesParser());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(express.static(__dirname + '/public'));  

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});


/* Start Api Routes */
app.use('/api', require('./routes/apiRoutes'));
/* ends */

app.use(fileupload());
router(app);


app.listen(port,()=> { 
	console.log(`Server is listening at ${port} port`);
});
