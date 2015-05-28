//accounts.js
var User = require('../models/user');

//create new accounts or delete them.

module.exports = {
	createAccount: function(req){
		User.findOne({ 'email' :  req.body.email }, function(err,email) {
			// if there are any errors, return the error
			console.log(req.body);
			if (err)
				return err;
			// check to see if there's already a user with that email
			if (email) {
		    	return req.flash('error', 'That email is already taken.');
		    } else {
				// if there is no user with that email
	            // create the user
	            var newUser            = new User();
	            // set the user's local credentials
	            newUser.email    = req.body.email;
	            newUser.password = newUser.generateHash(req.body.password); // use the generateHash function in our user model
				newUser.fname = req.body.fname.capitalize();
				newUser.lname = req.body.lname.capitalize();
				if(req.body.admin){
					newUser.admin = true;
				}
				// save the user
	            newUser.save(function(err) {
	                if (err){
	                	console.log(err)
	                	throw err;
	                }
					console.log("new user created!");
	                return true;
	            });
	        }
		}
	)},

	deleteAccount: function(req,done){
	},

	updateFirstName: function(req,done){
	},
	updateLastName: function(req,done){
	},
	showUsers: function (req){
	},
	deleteAccount: function(email){
		User.find({ email:email }).remove().exec();
	}
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
