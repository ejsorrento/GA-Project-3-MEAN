var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/diddy');
var Schema = mongoose.Schema;

var SequenceSchema = new Schema ({
  note: Array
});

var Sequence = mongoose.model("Sequence", SequenceSchema);
module.exports = mongoose;
