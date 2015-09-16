// app/router.js
var User = require('./models/user');
var Recordings = require('./models/recordings');
var Accounts = require('./config/accounts');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

module.exports = function(app, passport) {

	//app.get('/*', function(req, res, next){
	//	res.setHeader('Last-Modified', (new Date()).toUTCString());
	//	next();
//	});

		//SINGING ROOM

		app.get('/singingVR',isLoggedIn, function(req, res) {

			res.render('webvr/singing.jade',{user:req.user});
		});
//WEBVR examples
		 app.get('/monkeys',isLoggedIn, function(req, res) {

			 res.render('webvr/monkeys.jade',{user:req.user});
     });

		app.get('/cubes',isLoggedIn, function(req, res) {

			res.render('webvr/cubes.jade',{user:req.user});
		});
	/*	app.get('/threejs',isLoggedIn, function(req, res) {

			res.render('webvr/threejs.jade',{user:req.user});
		});*/
		app.get('/polarsea',isLoggedIn, function(req, res) {

			res.render('webvr/polarsea.jade',{user:req.user});
		});
		app.get('/game',isLoggedIn, function(req, res) {

			res.render('game.jade',{user:req.user});
		});
		app.get('/recordings',isLoggedIn, function(req, res) {

			Recordings.find({},'-_id -__v', function(err, recs) {
				jsonRecs = JSON.stringify(recs);
				res.render('recordings.jade',{
					user:req.user, jRecordings:jsonRecs
				});
				console.log(jsonRecs);
			}).sort('recDate');
		});
		app.get('/users',isLoggedIn, function(req, res) {
			User.find({'admin':false},'-_id fname lname email', function(err, users) {
				jsonUsers = JSON.stringify(users);
				res.render('users.jade',{
					user:req.user, jUsers:jsonUsers
				});

			}).sort('fname');

			/*res.render('users.jade',{
			user: req.user
		}); // load the index.jade file*/
	});
		app.get('/layout', function(req, res) {
        res.render('layout.jade'); // load the index.jade file
    });
    // =====================================
    // INDEX PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.jade',{ user: req.user}); // load the index.jade file
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
    // process the login form
    // app.post('/login', do all our passport stuff here);
 // process the login form
    /*app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));*/
		app.post('/login', function(req, res, next){
			passport.authenticate('local-login', function(err, user, info){
				// This is the default destination upon successful login.
				var redirectUrl = '/home';

				if (err) { return next(err); }
				if (!user) { return res.redirect('/'); }

				// If we have previously stored a redirectUrl, use that,
				// otherwise, use the default.
				if (req.session.redirectUrl) {
					redirectUrl = req.session.redirectUrl;
					req.session.redirectUrl = null;
				}
				req.logIn(user, function(err){
					if (err) { return next(err); }
				});
				res.redirect(redirectUrl);
			})(req, res, next);
		});
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup',isLoggedIn, function(req, res) {
	//	console.log(req.user);
		if(req.user.admin){
        // render the page and pass in any flash data if it exists
        	res.render('signup.jade', {user: req.user, message: req.flash('signupMessage') });
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
		//PASSWORD Manager
		app.get('/forgotpass', function(req, res) {
		  res.render('forgotpass.jade', {
		    user: req.user, message: req.flash('forgotPassMessage')
		  });
		});
		app.post('/forgotpass', function(req, res, next) {
			async.waterfall([
				function(done) {
					crypto.randomBytes(20, function(err, buf) {
						var token = buf.toString('hex');
						done(err, token);
						});
						},
						function(token, done) {
							User.findOne({ email: req.body.email }, function(err, user) {
								if (!user) {
									req.flash('forgotPassMessage', 'No account with that email address exists. Please contact a clinician.');
									return res.redirect('/forgotpass');
									}

									user.resetPasswordToken = token;
									user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

									user.save(function(err) {
										done(err, token, user);
										});
										});
										},
										function(token, user, done) {
											var smtpTransport = nodemailer.createTransport( {
												service: 'Gmail',
												auth: {
													user: 'mtherapy.unimelb@gmail.com',
													pass: 'musictherapy2015'
													}
													});
													var mailOptions = {
														to: user.email,
														from: 'passwordreset@demo.com',
														subject: 'Music Therapy Password Reset',
														text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
														'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
														'https://' + req.headers.host + '/reset/' + token + '\n\n' +
														'If you did not request this, please ignore this email and your password will remain unchanged.\n'
														};
														smtpTransport.sendMail(mailOptions, function(err) {
															req.flash('forgotPassMessage', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
															done(err, 'done');
															});
															}
															], function(err) {
																if (err) return next(err);
																res.redirect('/forgotpass');
																});
															});
	app.get('/reset/:token', function(req, res) {
		User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
			if (!user) {
				req.flash('forgotPassMessage', 'Password reset token is invalid or has expired.');
					return res.redirect('/forgotpass');
			}
			res.render('reset.jade', {
				user: req.user, message: req.flash('resetMessage')
			});
		});
	});

	app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
				var helper = new User();
        user.password = helper.generateHash(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport( {
        service: 'Gmail',
        auth: {
					user: 'mtherapy.unimelb@gmail.com',
					pass: 'musictherapy2015'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('loginMessage', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/login');
  });
});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
		req.session.redirectUrl = req.url;
    res.redirect('/login');
};
