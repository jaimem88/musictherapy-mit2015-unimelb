// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
	email        : { type: String, required: true, unique: true },
	fname : { type: String, default : ""},
	lname : { type: String, default : ""},
	password     : {type: String, required : true},
	admin : { type: Boolean, required: true, default: false},
	resetPasswordToken : String,
	resetPasswordExpires : Date,
	recordings: [{
		session: Number,
		recording: Number,
		recDate: Date,
		fileName: String,
		filePath: String

	}]
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Users', userSchema);
