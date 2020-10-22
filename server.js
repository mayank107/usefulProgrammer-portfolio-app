var database_url='mongodb+srv://kotharimanu2:kotharimanu2@usefulprogrammerpractis.teeia.mongodb.net/usefulprogrammerPractise?retryWrites=true&w=majority'

// server.js
// where your node app starts
mongoose.connect(database_url);
// init project
var express = require('express');
var app = express();
var port= process.env.PORT || 3000;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var shortid = require('shortid');
 
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


app.get("/timestamp", function (req, res) {
  res.sendFile(__dirname + '/views/timestamp.html');
});

app.get("/requestHeaderParser", function (req, res) {
  res.sendFile(__dirname + '/views/requestHeaderParser.html');
});

app.get("/urlShortenerMicroservice", function (req, res) {
  res.sendFile(__dirname + '/views/urlShortenerMicroservice.html');
});

app.get("/excercise-tracker", function (req, res) {
  res.sendFile(__dirname + '/views/excercise-tracker.html');
});
app.get("/file-metacharacter", function (req, res) {
  res.sendFile(__dirname + '/views/file-metacharacter.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//Request Header Parser

app.get("/api/whoami", function (req, res) {
  res.json({
    "ipaddress" :req.connection.remoteAddress,
    "language" :req.headers["accept-language"],
    "software" :req.headers["user-agent"]
  });
});


// TimeStamp Microservice

app.get("/api/timestamp/", (req, res) => {
  res.json({ unix: Date.now(), utc: Date() });
});

app.get("/api/timestamp/:date_string", (req, res) => {
  let dateString = req.params.date_string;

  //A 4 digit number is a valid ISO-8601 for the beginning of that year
  //5 digits or more must be a unix time, until we reach a year 10,000 problem
  if (/\d{5,}/.test(dateString)) {
    dateInt = parseInt(dateString);
    //Date regards numbers as unix timestamps, strings are processed differently
    res.json({ unix: dateString, utc: new Date(dateInt).toUTCString() });
  }

  let dateObject = new Date(dateString);

  if (dateObject.toString() === "Invalid Date") {
    res.json({ "error" : "Invalid Date" });
  } else {
    res.json({ unix: dateObject.valueOf(), utc: dateObject.toUTCString() });
  }
});

//url Shortening microservice


var shortURL=moongoose.model("shortURL",new Schema({
  short_url:String,
  original_url:String,
  suffix:String
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.post("/api/shorturl/new/",function(req,res){
  let client_requested_url=req.body.url
  let suffix=shortid.generate();
  let newshorturl=suffix;
  
  let newURL=new shortURL({
    "short_url":__dirname+"/api/shorturl/"+suffix,
    "original_url":client_requested_url,
    "suffix":suffix
  })
  newURL.save((err,doc)=>{
    if(err) return console.error(err);
    res.json({
      "saved":true,
      "short_url":newURL.shortURL,
      "original_url":newURL.original_url,
      "suffix":newURL.suffix

    });
  });
});
app.get("/api/shorturl/:suffix",(req,res)=>{
  let userGeneratedSuffix= req.params.suffix;
  shortURL.find({suffix:userGeneratedSuffix}).then(foundurls=>{
    let urlForRedirect= foundurls[0];
    res.redirect(urlForRedirect.original_url);
  })
});


// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
