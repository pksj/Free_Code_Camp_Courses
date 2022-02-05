const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// Mongoose Operations

const mongoURI = process.env['MONGO_URI'];
// console.log(mongoURI)
const mongoose = require('mongoose');

mongoose.connect(mongoURI,{ useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    username:{type: String}
}, { versionKey: false });

const exerciseSchema = new mongoose.Schema({
    ":_id": {type: String},
    description:{type: String},
    duration: {type: Number},
    date: { type: String}
}, { versionKey: false }); 

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);



app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const listener = app.listen(process.env.PORT || 3000, () => {
  // console.log('Your app is listening on port ' + listener.address().port)
})


app.post("/api/users", async function(req, res){

  const newUser = await User.create({username:req.body.username})
  console.log(newUser);
  res.json(newUser);
 
});



app.post("/api/users/:_id/exercises",  function(req, res){

  newExercise={};

  newExercise[':_id'] = req.params._id;
  newExercise['description'] = req.body.description;
  newExercise['duration'] = Number(req.body.duration);

  if(req.body.date){
    const d = new Date(req.body.date);
    newExercise['date'] = d.toDateString();
    // console.log("if date", newExercise['date']);
  }
  else{
    const d = new Date();
    newExercise['date'] = d.toDateString();
    // console.log("else date", newExercise['date']);
  }
  User.findOne({_id:req.params._id},  async function(err,doc)
  {
   // console.log("req.params['_id'] ",req.params._id) 
   // console.log("doc  ",doc)

   if(!err && doc !==  null)
   {
      newExercise['username'] =   await doc.username;
      Exercise.create(newExercise, function(err,docs)
      {
        // console.log("err ",err) 
        if(!err && docs !== undefined)
        {
          newExercise['_id'] = newExercise[':_id'] 
          delete newExercise[':_id']
          res.json(newExercise);
        }
        else
        {
          res.send("there was error while saving this exercise.")
        }
      }); 

   }
  })
});

app.get("/api/users", async function(req, res){

  const allusers = await User.find();
  res.json(allusers);

});



app.get("/api/users/:id/logs", async function(req, res){

  let  responseObject = {}
  responseObject['_id'] = req.params.id;

  const myUser = await User.findOne({'_id':req.params.id});
  responseObject['username'] = myUser.username;
  
  const myUserExerices = await Exercise.find({':_id':req.params.id});
     
  responseObject['count'] = myUserExerices.length;
  responseObject['log'] = new Array(myUserExerices.length)
  for(let i = 0; i < myUserExerices.length; i++)
  {
    responseObject['log'][i] = {};
    responseObject['log'][i]['description'] = myUserExerices[i].description;
    responseObject['log'][i]['duration'] = myUserExerices[i].duration;
    responseObject['log'][i]['date'] = myUserExerices[i].date;
  }  

  console.log("responseObject ",responseObject);
  
  
  //Copied below code from "https://www.notion.so/Exercise-Tracker-8cd21bd626034f358c511f312e662789"

  if(req.query.from || req.query.to){
    
    let fromDate = new Date(0)
    let toDate = new Date()
    
    if(req.query.from){
      fromDate = new Date(req.query.from)
    }
    
    if(req.query.to){
      toDate = new Date(req.query.to)
    }
    
    fromDate = fromDate.getTime()
    toDate = toDate.getTime()
    
    responseObject.log = responseObject.log.filter((session) => {
      let sessionDate = new Date(session.date).getTime()
      
      return sessionDate >= fromDate && sessionDate <= toDate
      
    })
    
  }
   
  if(req.query.limit){
    responseObject.log = responseObject.log.slice(0, req.query.limit)
  }

  res.json(responseObject);
})
