// index.js
const exec = require('child_process').exec;

const fs = require('fs');
/*
const options = {
  key: fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.crt'),
  passphrase: 'jobcan'
};
*/
const domain = require('./domain.json');

const port = process.argv[2] || '3051'
const express = require('express')
const app = express()
app.use('/easy-jobcan', express.static('docs'))
/*
const server = require('https').createServer(options, app)
server.listen(process.env.PORT||port, () => {
  console.log('Server On : https://localhost:'+server.address().port)
})
*/
require('letsencrypt-express').create({
  server: 'staging'
, email: domain.email
, agreeTos: true
, approveDomains: [ domain.domain ]
, app: app
}).listen(3000, port, ()=>{
  console.log('Server On : '+ domain +':'+ port)
});

app.get('/', (req, res) => {
  res.redirect('/easy-jobcan')
})

app.get('/api/:func', (req, res, next) => {
  let company_id = req.query.company_id
  let email = req.query.email
  let password = req.query.password
  // let func = 'attend', 'work_status', 'over_work'
  let func = req.params.func
  // func = 'work_status'
  let work_status = ''
  console.log(company_id, email, password)
  res.set({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
  })
  console.log(req.query);
  let exec_command = `casperjs phantom/attend.js --company_id=${company_id} --email=${email} --password=${password} --func=${func} --mode=product`
  if (func === 'over_work') {
    exec_command = `${exec_command} --reason=${req.query.reason.replace(/\n/g,'_br_')} --end_h=${req.query.over_work_hour} --end_m=${req.query.over_work_min}`
    // next()
  }
  exec(exec_command, (error, stdout, stderr) => {
    console.log(exec_command);
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
/*
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
*/
