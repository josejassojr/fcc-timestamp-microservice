// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/copy-index", function(req, res) {
  res.sendFile(__dirname + "/views/copy-index.html");
});

app.get(
  "/api",
  function(req, res, next) {
    var date = new Date();
    // console.log(req.time);
    req.utc = date.toUTCString();
    req.unix = Date.parse(req.utc);
    next();
  },
  function(req, res) {
    res.json({ unix: req.unix, utc: req.utc });
  }
);


app.get(
  "/api/:date",
  function (req, res, next) {
    req.code = 1;
    var date = new Date(req.params.date).toUTCString();
    if (date === "Invalid Date") {
      if (isNaN(Number(req.params.date))) {
        req.code = -1;
        console.log("Yikes");
        next();
      } else {
        date = new Date(Number(req.params.date)).toUTCString();
      }
    }
    req.utc = date;
    req.unix = Date.parse(req.utc);
    next();
  },
  function (req, res) {
    if (req.code === -1) {
      res.json({ error: "Invalid Date" });
    } else {
      res.json({ unix: req.unix, utc: req.utc });
    }
  }
);




// listen for requests :)
var port = process.env.PORT || 3000;
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  console.log("testing testing testing....");
});
