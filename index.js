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
const exercises = []
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
  const { limit, from, to } = req.query
  const user = users.find(user => user._id === _id)
  if (!user) {
    res.status(404).json({ error: 'user not found' })
  } else {
    const exercises = user.exercises

    if (!from && !to) {
      res.json({ _id, username: user.username, count: exercises.length, log: exercises })
    } else if (from && !to) {
      const filteredExercises = exercises.filter(exercise => new Date(exercise.date) >= new Date(from))
      res.json({ _id, username: user.username, count: filteredExercises.length, log: filteredExercises })
    } else if (!from && to) {
      const filteredExercises = exercises.filter(exercise => new Date(exercise.date) <= new Date(to))
      res.json({ _id, username: user.username, count: filteredExercises.length, log: filteredExercises })
    } else {
      const filteredExercises = exercises.filter(exercise => new Date(exercise.date) >= new Date(from) && new Date(exercise.date) <= new Date(to))
      res.json({ _id, username: user.username, count: filteredExercises.length, log: filteredExercises })
    }
  }
  res.send("OK")
})
app.post('/api/users', (req, res) => {
  const { username } = req.body
  const _id = Date.now().toString();
  const user = { username, _id }
  users.push(user)

    // const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  if (!username) {
    res.status(400).json({ error: 'username is required' })
  } else {
    res.status(201).json({ username, _id })
    // console.log(users);
    
  }
})

app.post('/api/users/:_id/exercises', (req, res) => {
  
  const { description, duration } = req.body
  var date = req.body.date;
  if (!date) {date = new Date();}
  const { _id } = req.params
  if (!description) {
    res.status(400).json({ error: 'description is required' })
  } else if (!duration) {
    res.status(400).json({ error: 'duration is required' })
  } else {
    date = new Date(date).toDateString();
    const exercise = { description, duration, date }
    const user = users.find(user => user._id === _id)
    const username = user.username
    exercises.push(exercise)
    user.exercise = exercises;
    const newUser = { username, description, duration, date, _id }
    
    // res.status(201).json({ username: _id, description, duration, date })
    // res.status(201).json({ user, username, description, duration, date, _id })

    res.status(201).json(newUser)
    
  }
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
