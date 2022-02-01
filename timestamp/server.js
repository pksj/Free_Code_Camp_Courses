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


// your first API endpoint... 

// your first API endpoint... 
app.get("/api/:date", function (req, res) {

  const myDate = req.params.date;
  
  console.log(Number.isNaN(Number(myDate)));

  if(myDate == "")
  {
    res.json({unix:  Date.now(), utc: new Date()});  
  }
  else if(Number.isNaN(Number(myDate)) == false){
    console.log("if");
    res.json({unix: Number(myDate), utc: new Date(Number(myDate))});  
  }
  else if((Date(myDate).toString != "Invalid Date") && (Date.parse(myDate) != NaN))
  {
    res.json({unix: Date.parse(myDate), utc: new Date(myDate)}); 
    console.log("else if");
  }
  else{
    console.log("else");
    res.json({error : "Invalid Date"});
  }

});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
