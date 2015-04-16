/**
Author:		Jaime Martinez
StudentID:	642231
Username:	jmartinez1
Subject:	ISYS90080
University:	The University of Melbourne
Institution:	Melbourne Networked Society Institue
Date Created:	April 1, 2015
Last Modified:	
**/

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require( __dirname + '/app/server/config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require(__dirname + '/app/server/config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade'); // set up jade for templating


// required for passport
app.use(session({ secret: 'mymommakesmemashmyminimandmsonamondaymorningoohah' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// routes ======================================================================
require('./app/server/router.js')(app, passport); // load our routes and pass in our app and fully configured passport
//Static content
app.use(express.static(__dirname + '/app/public'));


// launch ======================================================================
app.listen(port);
console.log('Server listening on port ' + port);
