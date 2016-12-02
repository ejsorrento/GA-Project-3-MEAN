var mongoose = require("./schema");
var seedData = require("./seeds");

var Sequence = mongoose.model("Sequence");

Sequence.remove({}).then(function() {
  Sequence.collection.insert(seedData).then(function() {
    process.exit();
  });
});
