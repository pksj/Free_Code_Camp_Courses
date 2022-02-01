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
app.get("/api/:date", function (req, res) {

  const myDate = req.params.date;
  
  // console.log(Number.isNaN(Number(myDate)));
  
  if(Number.isNaN(Number(myDate)) == false){
    
    x = new Date(Number(myDate));
    res.json({unix: Number(myDate), utc: x.toUTCString()});  
  
  }
  else if( new Date(myDate) == "Invalid Date")
  {
    res.json({error : "Invalid Date"});    
  }
  else
  {  
    x = new Date(myDate);
    res.json({unix: Date.parse(myDate), utc: x.toUTCString()});   
  }

});

app.get("/api", function (req, res) {

  const myDate = req.params.date;
  
  res.json({unix:  Date.now(), utc: new Date()});  
  
})



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
