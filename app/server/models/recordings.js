var mongoose = require('mongoose');
// define the schema for our user model
var recordingSchema = mongoose.Schema({
  session : Number,
  recording : Number,
  recDate : Date,
  fileName: String,
  filePath: String
});


module.exports = mongoose.model('Recordings', recordingSchema);
