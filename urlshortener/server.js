require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true} ));


// Mongoose Operations

const mongoURI = process.env['MONGO_URI'];
const mongoose = require('mongoose');

mongoose.connect(mongoURI,{ useNewUrlParser: true});

const urlSchema = new mongoose.Schema({
    original_url:{type: String},
    short_url:{type:Number}
});

const URLShortener = mongoose.model('URLShortener', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  // console.log(req.body)

  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  
  if (regexp.test(req.body.url) == false)
  {
    res.json({error: 'invalid url'})
    return
  }

  console.log( req.body.url);

  URLShortener.findOne({ original_url: req.body.url},  async function (err, docs) {
    
    let number =  await URLShortener.estimatedDocumentCount();
    // let number = 1;
    // console.log(number)
    // console.log(err)
    if(docs === null)
    {
      // console.log("if")
      URLShortener.create({ original_url: req.body.url,
                              short_url: number+1});
      res.json({original_url: req.body.url, short_url: number+1});
    }
    else
    {
      // console.log("else")
      // console.log("docs", docs)
      res.json({original_url: docs.original_url,
                shot_url:docs.short_url});
    }
  });

});


app.get('/api/shorturl/:id', function(req, res) {
  
  // console.log("ID " + req.params.id);

  URLShortener.findOne({ short_url: req.params.id}, function(err, docs) {
    
    if(!err && docs != undefined){
      res.redirect(docs.original_url)
    }else{
      res.json('URL not Found')
    }
  });
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
