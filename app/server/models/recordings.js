var mongoose = require('mongoose');
// define the schema for our user model
var recordingSchema = mongoose.Schema({
  user : { type: String, required: true},
  session : Number,
  recording : Number,
  recDate : Date,
  fileName: String,
  file : {data:Buffer, contentType: String}
});


module.exports = mongoose.model('Recordings', recordingSchema);
