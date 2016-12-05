var express = require("express");
var parser = require("body-parser");
var hbs = require("express-handlebars");
var mongoose = require("./db/schema");
var app = express();
// var piano= require("assets/js/piano")

var Song = mongoose.model("Song");

app.set("port", process.env.PORT || 3001);
app.set('view engine', 'hbs');
app.engine(".hbs", hbs({
  extname:        ".hbs",
  partialsDir:    "views/",
  layoutsDir:     "views/",
  defaultLayout:  "layout-main"
}));
app.use("/assets", express.static("public"));
app.use(parser.json({extended: true}));

app.get("/", function(req, res) {
res.render("songs-index");
});

app.get("/api/songs", function(req, res) {
  Song.find({}).then(function(songs){
  res.json(songs);
});
});

app.get("/api/songs/:name", function(req, res) {
  Song.findOne({name:req.params.name}).then(function(song) {
    res.json(song);
  });
});

app.post("/api/songs", function(req, res) {
  console.log(req.body)
  Song.create(req.body).then(function(song){
    res.json(song);
  });
});

app.put("/api/songs/:name", function(req, res) {
  Song.findOneAndUpdate({name:
  req.params.name}, req.body, {new: true}).then(function(song) {
    res.json(song);
  });
});

app.delete("/api/songs/:name", function(req, res) {
  Song.findOneAndRemove({name:
    req.params.name}).then(function() {
    res.json({ success: true });
  });
});
// app.get("/api/album/songs/:id"

app.listen(3001, () => {
  console.log("app listening");
});
