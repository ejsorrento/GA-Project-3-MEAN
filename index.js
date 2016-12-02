var express = require("express");
var app = express();


app.get("/", (req, res) => {
  res.send("QWERTY");
});



app.listen(3001, () => {
  console.log("app listening");
});
