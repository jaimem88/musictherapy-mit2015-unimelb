// app/router.js
var User = require('./models/user');
var Accounts = require('./config/accounts');
module.exports = function(app, passport) {

	//app.get('/*', function(req, res, next){ 
	//	res.setHeader('Last-Modified', (new Date()).toUTCString());
	//	next(); 
//	});
    // =====================================
    // INDEX PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.jade'); // load the index.jade file
    });
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
	app.get('/home', isLoggedIn, function(req, res) {
        res.render('home.jade', {
            user : req.user // get the user out of session and pass to template
        }); 

    });
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.jade', { message: req.flash('loginMessage') }); 
    });
//manage forgotten PASSWORD  HEREEEEEEEEEEEEEE
	app.get('/forgotpass', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('forgotpass.jade');
    });
    // process the login form
    // app.post('/login', do all our passport stuff here);
 // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup',isLoggedIn, function(req, res) {
	//	console.log(req.user);
		if(req.user.admin){	
        // render the page and pass in any flash data if it exists
        	res.render('signup.jade', { message: req.flash('signupMessage') });
		}else{
				res.redirect('/profile');
		}
    });
	
    // process the signup form
    app.post('/signup', isLoggedIn,function(req,res){
    	    Accounts.createAccount(req);
    	    res.redirect('/profile');
    });
    
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.jade', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
};
