var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/diddy');
var Schema = mongoose.Schema;

var SongSchema = new Schema ({
  sequence: Array,
  name: String,
  credit: String,
  timestamp: Date
});

var AlbumSchema = new Schema ({
  title: String,
  songs: [SongSchema]
});

mongoose.model("Album", AlbumSchema);
mongoose.model("Song", SongSchema);
module.exports = mongoose;
