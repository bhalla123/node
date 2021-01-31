const express = require('express');
const bodyParser = require('body-parser');
const router = require('router');
const passport = require('passport');
const sequelize = require('sequelize');
const db = require('./models');
const dotenv = require('dotenv');
require('express-group-routes');
const path = require('path');

var middleware = require("./middlewares");

const port = process.env.PORT || 3000
const app = express();

// body parser
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

app.use(express.static(__dirname + '/public'));  


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});


app.group('/api/v1',(router) => {
  router.use( middleware.isActive, middleware.apiKeyCheck);
});

/* Start Api Routes */
app.use('/api', require('./routes/apiRoutes'));

 /* ends */

router(app);

app.listen(port,()=> { 
	console.log(`Server is listening at ${port} port`);
});

