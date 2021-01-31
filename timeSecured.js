const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const router = require('router');
const flash = require('connect-flash');
const session = require('express-session');
const cookiesParser = require('cookie-parser');
var fileupload = require("express-fileupload");
const passport = require('passport');
const sequelize = require('sequelize');
const db = require('./models');
const dotenv = require('dotenv');
require('express-group-routes');
const path = require('path');

var middleware = require("./middlewares");

const port = process.env.PORT || 3000
const app = express(require('geolocation'));


// Express body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

db.sequelize.sync({ force: false })


// EJS
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//app.use(bodyParser.json({ type: 'application/*+json' }));
//app.use(express.static(__dirname + '/public'));  

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});


app.group((router) => {
  router.use(middleware.apiKeyCheck);
});

/* Start Api Routes */
app.use('/api', require('./routes/apiRoutes'));

//app.use(fileupload())
/* ends */

router(app);

app.listen(port,()=> { 
	console.log(`Server is listening at ${port} port`);
});

