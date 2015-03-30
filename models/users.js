// User Schema

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
   username: { type: String, required: true, unique: true },
   contacts: { type: [String] },
 });

var users = mongoose.model('users',userSchema);
module.exports = users;