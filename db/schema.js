var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/diddy');
var Schema = mongoose.Schema;

var SongSchema = new Schema ({
  sequence: Array,
  songName: String
});

var Song = mongoose.model("Song", SongSchema);
module.exports = mongoose;
