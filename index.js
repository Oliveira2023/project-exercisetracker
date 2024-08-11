const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
// app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false }));
const users = []
let exercises = []
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});
app.get('/api/users', function (req, res) {// não funciona /api/users se mudar para /teste dá certo, não entendi porque ainda. funcionou, sem saber porque, só coloquei o /api/userst e depois tirei o t e funcionou sem fazer nenhuma alteração extra no codigo
  res.json(users);
});
app.get('/api/users/:_id/logs', (req, res) => {

  const { _id } = req.params
  const { from, to } = req.query
  let limit = Number(req.query.limit)
  const user = users.find(user => user._id === _id)
  if (!user) {
    res.status(404).json({ error: 'user not found' })
  } else {

    if (!from && !to && !limit) {
      
      res.json({username: user.username, count: user.exercises.length, _id,  log: user.exercises })
    } else if (from && !to && !limit) {
      const filteredExercises = user.exercises.filter(exercise => new Date(exercise.date) >= new Date(from))
      res.json({ _id, username: user.username, count: filteredExercises.length, log: filteredExercises })
    } else if (!from && to && !limit) {
      const filteredExercises = user.exercises.filter(exercise => new Date(exercise.date) <= new Date(to))
      res.json({ _id, username: user.username, count: filteredExercises.length, log: filteredExercises })
    } else if (from && to && !limit) {
      const filteredExercises = user.exercises.filter(exercise => new Date(exercise.date) >= new Date(from) && new Date(exercise.date) <= new Date(to))
      res.json({ _id, username: user.username, count: filteredExercises.length, log: filteredExercises })
    } else if (!from && !to && limit) {
      let filteredExercises = []
      if (user.exercises.length<limit) limit = user.exercises.length
      for (let i=0; i<limit; i++){
        filteredExercises.push(user.exercises[i])
      }
      res.json({ _id, username: user.username, count: filteredExercises.length, log: filteredExercises })
    }else {
      const filteredExercises = user.exercises.filter(exercise => new Date(exercise.date) >= new Date(from) && new Date(exercise.date) <= new Date(to))
      if(filteredExercises.length<limit) limit = filteredExercises.length
      const limitFilteredExercises = [];
      for(let i = 0; i < limit; i++) {
        limitFilteredExercises.push(filteredExercises[i])
      }
      res.json({ _id, username: user.username, count: limitFilteredExercises.length, log: limitFilteredExercises })
    }
  }
  res.send("OK")
})
app.post('/api/users', (req, res) => {
  const { username } = req.body
  const _id = Date.now().toString();
  const user = { username, _id }
  users.push(user)

  if (!username) {
    res.status(400).json({ error: 'username is required' })
  } else {
    res.status(201).json({ username, _id })
    // console.log(users);
    
  }
})

app.post('/api/users/:_id/exercises', (req, res) => {
  
  const { description } = req.body
  const duration = Number(req.body.duration)
  var date = req.body.date;
  if (!date) {date = new Date();}
  const { _id } = req.params
  if (!description) {
    res.status(400).json({ error: 'description is required' })
  } else if (!duration) {
    res.status(400).json({ error: 'duration is required' })
  } else {
    date = new Date(date).toDateString();
    console.log(new Date(date));
    
    const exercise = { description, duration, date }
    const user = users.find(user => user._id === _id)
    const username = user.username
    exercises.push(exercise)
    // console.log(exercises);
    
    if (user.exercises) {
      user.exercises.push(exercise)
    }else {
      user.exercises = exercises
    }
    exercises = []
    // res.status(201).json({ user })
    res.json({ username, description, duration, date, _id })
    
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
