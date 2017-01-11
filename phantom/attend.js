var casper = require("casper").create({viewportSize: { width: 1024, height: 768 }});
// var login = require("./config.json")
var jobcan_helper = require('./jobcan_helper.js');
// console.log(process.argv[0], process.argv[1])

// var casper = require('casper').create();

/*
$ casperjs test.js arg1 arg2 arg3 --foo=bar --plop anotherarg
Casper CLI passed args: [
    "arg1",
    "arg2",
    "arg3",
    "anotherarg"
]
Casper CLI passed options: {
    "casper-path": "/Users/niko/Sites/casperjs",
    "cli": true,
    "foo": "bar",
    "plop": true
}
*/
// casperjs attend.js --company_id=COMPANY_ID --email=EMAIL --password=PASS --func=[attend/work_status/over_work] --reason=理由 --mode=[dev/product]


var func = casper.cli.options['func']

var configs = {
  company_id: casper.cli.options['company_id'],
  email: casper.cli.options['email'],
  pass: casper.cli.options['password'],
  mode: casper.cli.options['mode']
}

if (configs.mode == 'dev') {
  // casper.echo("Casper CLI passed args:");
  // require("utils").dump(casper.cli.args);

  casper.echo("Login options:");
  require("utils").dump(casper.cli.options);
}

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/7.0.2 Safari/537.74.9');
//console.log(__dirname);
/*
casper.start('https://ssl.jobcan.jp/login/pc-employee/?client_id='+login.company_id, function(){
    //
  this.sendKeys('input#email', login.email, {reset: true});
  this.sendKeys('input#password', login.pass, {reset: true});
  //this.capture('out/intro_work_5.png');
});
casper.then(function(){
  if (mode === 'dev') {
    console.log('Login中')
  }
  this.click('button');
})

casper.then(function() {
  this.wait(1000, function() {
    //this.echo("ロード中");
    this.capture("out/"+datestamp()+"/"+timestamp()+"_before.png");
  });
});
*/
jobcan_helper.login(casper, configs)

/*
casper.then(function () {
  if (mode === 'dev') {
    console.log('打刻')
  }
  if (mode === 'product') {
    // console.log('p#adit-button-push')
    this.click('p#adit-button-push')
  }
})
*/
switch (func) {
  case 'over_work':
    var reason = casper.cli.options['reason'] || '仕事が長引いたため'
    console.log(reason)
    break;
  case 'attend':
    jobcan_helper.attend(casper, configs)
    // jobcan_helper.after_attend(casper, configs)
    break;
  case 'work_status':
    // break;
  default:
    jobcan_helper.working_status(casper, configs)
}


/*
casper.then(function() {
  this.wait(4000, function() {
    if (mode === 'dev') {
      this.echo("打刻完了");
    }
    getWorkStatus(this)
    //this.echo(timestamp())
    this.capture("out/"+datestamp()+"/"+timestamp()+"_after.png");
  });
});
*/


casper.run();

/*
var datestamp = function () {
  var date = new Date();
  //console.log(date.toLocaleString());
  var result = date.toLocaleDateString()
  //console.log(result);
  return result
}
var timestamp = function () {
  var date = new Date();
  var str_arry = date.toLocaleString().split(" ")
  var result = str_arry[0]+"_"+str_arry[1]
  return result
}
*/
/*
var getWorkStatus = function (dom) {
  var working_status = dom.evaluate(function(){
    return document.getElementById('working_status').innerHTML
  })
  console.log(working_status)
  // require("utils").dump(working_status)
}
*/
