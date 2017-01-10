// index.js
const port = process.argv[2] || '3051'
const express = require('express')
const app = express()
app.use('/easy-jobcan', express.static('docs'))
const server = require('http').createServer(app)
server.listen(process.env.PORT||port, () => {
  console.log('Server On : http://localhost:'+server.address().port)
})

app.get('/', (req, res) => {
  res.redirect('/easy-jobcan')
})

app.get('/attend', (req, res) => {
  let company_id = req.query.company_id
  let email = req.query.email
  let password = req.query.password
  console.log(company_id, email, password)
  res.set({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
  })
  let response = {
    text : '出勤中',
    time : (new Date()).toLocaleString()
  }
  res.send(response)
})
