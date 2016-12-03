var express = require("express");
var parser = require("body-parser");
var hbs = require("express-handlebars");
var mongoose = require("./db/schema");
var app = express();

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

app.get("/", (req, res) => {
res.render("songs-index");
});

app.get("/api/songs", (req, res) => {
  Song.find({}).then(function(songs){
  res.json();
});
});

app.listen(3001, () => {
  console.log("app listening");
});
