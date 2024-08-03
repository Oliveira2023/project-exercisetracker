const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.get('/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});
app.use(express.urlencoded({ extended: true }))
// app.use(express.json())
app.post('/api/users', (req, res) => {
  const { username } = req.body
  // const username = req.body.username
  if (!username) {
    res.status(400).json({ error: 'username is required' })
  } else {
    res.status(201).json({ username })
  }
})
app.post('/api/users/:_id/exercises', (req, res) => {
  const { description, duration, date } = req.body
  const { _id } = req.params
  if (!description) {
    res.status(400).json({ error: 'description is required' })
  } else if (!duration) {
    res.status(400).json({ error: 'duration is required' })
  } else if (!date) {
    res.status(400).json({ error: 'date is required' })
  } else {
    const dateObj = new Date(date)
    if (isNaN(dateObj)) {
      res.status(400).json({ error: 'invalid date' })
    } else {
      res.status(201).json({ username: _id, description, duration, date })
    }
  }
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
