// patching phantomjs' require()
// var require = patchRequire(require);

exports.login = function (casper, config) {
  casper.start('https://ssl.jobcan.jp/login/pc-employee/?client_id='+config.company_id, function(){
      //
    this.sendKeys('input#email', config.email, {reset: true});
    this.sendKeys('input#password', config.pass, {reset: true});
    //this.capture('out/intro_work_5.png');
  });
  casper.then(function(){
    if (config.mode === 'dev') {
      console.log('Login中')
    }
    this.click('button');
  })
}

exports.attend = function (casper, config) {
  casper.then(function() {
    this.wait(1000, function() {
      //this.echo("ロード中");
      this.capture("out/"+datestamp()+"/"+config.email.split('@')[0]+"/"+timestamp()+"_before.png");
    });
  });
  casper.then(function () {
    if (config.mode === 'dev') {
      console.log('打刻')
    }
    if (config.mode === 'product') {
      // console.log('p#adit-button-push')
      this.click('p#adit-button-push')
    }
  });
  casper.then(function() {
    this.wait(4000, function() {
      if (config.mode === 'dev') {
        this.echo("打刻完了");
      }
      getWorkStatus(this)
      // this.echo(timestamp())
      this.capture("out/"+datestamp()+"/"+config.email.split('@')[0]+"/"+timestamp()+"_after.png");
    });
  });
}

exports.after_attend = function (casper, config) {
  /*
  casper.then(function() {
    this.wait(4000, function() {
      if (mode === 'dev') {
        this.echo("打刻完了");
      }
      // getWorkStatus(this)
      // this.echo(timestamp())
      this.capture("out/"+datestamp()+"/"+config.email.split('@')[0]+"/"+timestamp()+"_after.png");
    });
  });
  */
}

exports.working_status = function (casper, config) {
  casper.then(function () {
    this.wait(500, function() {
      getWorkStatus(this)
    });
    // getWorkStatus(this)
  })
}

exports.over_work = function (casper, config, condition) {
  var openOverWorkPage = function () {
    window.open("https://ssl.jobcan.jp/employee/over-work/new","_self")
  }
  casper.then(function () {
    this.wait(500, function() {
      this.evaluate(openOverWorkPage)
    });
  })
  casper.then(function () {
    this.wait(500, function() {
      this.sendKeys('select#end_h', condition.end_h.replace('_',''), {reset: true});
      this.sendKeys('select#end_m', condition.end_m.replace('_',''), {reset: true});
      this.sendKeys('textarea[name="description"]', condition.reason.replace(/_br_/g, '\n'), {reset: true});
      // console.log(condition.end_h.replace('_',''),condition.end_m.replace('_',''));
      // this.capture("out/"+datestamp()+"/"+config.email.split('@')[0]+"/"+timestamp()+"over_work_condition.png");
    });
  })
  casper.then(function () {
    this.click('input.btn.btn-info')
    this.wait(500,function () {
      this.capture("out/"+datestamp()+"/"+config.email.split('@')[0]+"/"+timestamp()+"over_work_confirm.png");
    })
  })
  casper.then(function () {
    if (this.getCurrentUrl().indexOf('error') === -1) {
      this.click('input.btn.btn-warning')
      this.wait(500,function () {
        this.capture("out/"+datestamp()+"/"+config.email.split('@')[0]+"/"+timestamp()+"over_work_success.png");
      })
    } else {
      console.log('already_applicated');
    }
  })
}

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

var getWorkStatus = function (dom) {
  var working_status = dom.evaluate(function(){
    return document.getElementById('working_status').innerHTML
  })
  console.log(working_status)
  // require("utils").dump(working_status)
}
