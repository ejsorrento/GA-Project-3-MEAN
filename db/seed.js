var mongoose = require("./schema");
var seedData = require("./seeds");

var Song = mongoose.model("Song");

Song.remove({}).then(function() {
  Song.collection.insert(seedData).then(function() {
    process.exit();
  });
});
