// index.js
const exec = require('child_process').exec;

const fs = require('fs');

const options = {
  key: fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.crt'),
  passphrase: 'jobcan'
};

const port = process.argv[2] || '3051'
const express = require('express')
const app = express()
app.use('/easy-jobcan', express.static('docs'))
const server = require('https').createServer(options, app)
server.listen(process.env.PORT||port, () => {
  console.log('Server On : https://localhost:'+server.address().port)
})

app.get('/', (req, res) => {
  res.redirect('/easy-jobcan')
})

app.get('/api/:func', (req, res, next) => {
  let company_id = req.query.company_id
  let email = req.query.email
  let password = req.query.password
  // let func = 'attend', 'work_status', 'over_work'
  let func = req.params.func
  if (func === 'over_work') {
    next()
  }
  // func = 'work_status'
  let work_status = ''
  console.log(company_id, email, password)
  res.set({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
  })

  let exec_command = `casperjs phantom/attend.js --company_id=${company_id} --email=${email} --password=${password} --func=${func} --mode=product`
  exec(exec_command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    work_status = stdout.trim()
    console.log(`stdout: ${stdout}`);
    let response = {
      text : work_status,
      time : (new Date()).toLocaleString()
    }
    res.send(response)
    /*console.log(`stderr: ${stderr}`);*/
  });
})

app.get('/api/over_work', function (req, res) {
  let company_id = req.query.company_id
  let email = req.query.email
  let password = req.query.password
  let func = 'over_work'
  let over_work_hour = req.query.over_work_hour
  let over_work_min = req.query.over_work_min
  let reason = req.query.reason
  res.set({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
  })
  console.log(over_work_hour, over_work_min, reason);
})
