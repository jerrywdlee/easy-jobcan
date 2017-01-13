
/*  */
var company_id = ''
, email = ''
, password = ''
, server_url = ''
, work_status = ''

$(document).on("pageinit", "#topPage", function(){
  /* データがない場合の対応 */
  $('#work_status').hide()
  if (!(localStorage['company_id']&&localStorage['email']&&localStorage['password']&&localStorage['server_url'])) {
    $('button.at-btn').prop("disabled", true)
    setTimeout(function () {
      $('#setting').click()
    }, 100);
  } else {
    resetInfos()
    updateAttrStatus()
  }
  /* 残業申請時間をセット */
  if (!(localStorage['over_work_hour']&&localStorage['over_work_min'])) {
    $('#over_work_hour').val(15).selectmenu('refresh'); // 20時
    $('#over_work_min').val(30).selectmenu('refresh'); // 30分
  } else {
    $('#over_work_hour').val(localStorage['over_work_hour']).selectmenu('refresh')
    $('#over_work_min').val(localStorage['over_work_min']).selectmenu('refresh')
  }
})

$(document).on("pageinit", "#setOverWorkPage", function(){
  $('span.over_work_day').html((new Date()).toLocaleDateString())
  $('span.over_work_time').html((parseInt($('#over_work_hour').val())+5)+':'+$('#over_work_min').val())
  if (localStorage['reason_select']) {
    $('#reason_select').val(localStorage['reason_select']).selectmenu('refresh')
    $('#reason_text').val($('#reason_select').val())
  }
  if (localStorage['reason_text']) {
    $('#reason_text').val(localStorage['reason_text'])
  } else {
    $('#reason_text').val($('#reason_select').val())
  }
  resizeTextarea()
  // resetInfos()
})

$(document).on("pageinit", "#setInfoPage", function(){
  $('#company_id').val(localStorage['company_id'])
  $('#email').val(localStorage['email'])
  $('#password').val(localStorage['password'])
  $('#server_url').val(localStorage['server_url'])
  resetInfos()
})

/* 主逻辑 */
$(document).ready(function(){
  /* 打刻 */
  resetInfos()
  $('#set_attendance').on('click', function () {
    // alert(this)
    // http://localhost:3051/attend?company_id=&email=&password=
    console.log(server_url,company_id,email,password);
    $('#set_attendance span').html('打刻中')
    $('#set_attendance').prop("disabled", true)
    $.get(server_url+'/api/attend',
    { company_id: company_id, email: email, password: password })
    .done(function (data) {
      console.log(data)
      var response = JSON.parse(data)
      // $('#work_status').html(response.text+' ('+response.time.split(' ')[1]+')')
      // $('#set_attendance span').html('出 退 勤')
      setWorkStatus(response)
      $('#set_attendance').prop("disabled", false)
    })
    .fail(function() {
      setWorkStatus({text:null})
      $('#set_attendance').prop("disabled", false)
    })
  })
  /* 勤怠の取得 */
  $('#work_status').on('click', function () {
    updateAttrStatus()
  })
  /* 残業理由のセット */
  $('#reason_select').on('change', function () {
    var tmp_reason_text = $('#reason_text').val() + '\n' + $('#reason_select').val()
    $('#reason_text').val(tmp_reason_text)
    resizeTextarea()
  })
  /* 残業申請 */
  $('#set_over_work').on('click', function () {
    localStorage.setItem('over_work_hour',$('#over_work_hour').val())
    localStorage.setItem('over_work_min',$('#over_work_min').val())
    localStorage.setItem('reason_select',$('#reason_select').val())
    localStorage.setItem('reason_text',$('#reason_text').val())
    // alert(this)
    if (confirm($('td.over_work_daytime').text()+'で残業申請しますか？')) {
      $('#set_over_work').prop("disabled", true)
      $.get(server_url+'/api/over_work',
      { company_id: company_id, email: email, password: password,
        over_work_hour: '_'+(parseInt($('#over_work_hour').val())+5),
        over_work_min: '_'+$('#over_work_min').val(),
        reason: $('#reason_text').val()
      })
      .done(function (data) {
        alert('残業申請しました！')
        $('#set_over_work').prop("disabled", false)
      })
      .fail(function() {
        alert('残業申請できませんでした！')
        $('#set_over_work').prop("disabled", false)
      })
    }
  })

  /* 保存 */
  $('#save_info').on('click', function () {
    if ($('#company_id').val()&&$('#email').val()&&$('#password').val()&&$('#server_url').val()) {
      localStorage.setItem('company_id',$('#company_id').val())
      localStorage.setItem('email',$('#email').val())
      localStorage.setItem('password',$('#password').val())
      localStorage.setItem('server_url',$('#server_url').val())
      alert('保存しました！')
      $('button.at-btn').prop("disabled", false)
      resetInfos()
      updateAttrStatus()
    } else {
      alert('データ不完全！')
    }
  })
})

function updateAttrStatus() {
  $('#work_status').html('勤怠ステータス取得中...').show()
  $.get(server_url+'/api/work_status',
  { company_id: company_id, email: email, password: password })
  .done(function (data) {
    console.log(data)
    var response = JSON.parse(data)
    setWorkStatus(response)
    // $('#set_attendance').prop("disabled", false)
  })
  .fail(function() {
    setWorkStatus({text:null})
  })
}

function resetInfos() {
  company_id = localStorage['company_id']
  email = localStorage['email']
  password = localStorage['password']
  server_url = localStorage['server_url']
}
function setWorkStatus(response) {
  if (response.text&&response.text !== 'null') {
    $('#work_status').html(response.text+' ('+response.time.split(' ')[1]+')')
  } else {
    $('#work_status').html('通信できません')
  }
  work_status = response.text || ''
  var button_text = '打 刻'
  switch (response.text) {
    case '勤務中':
      button_text = '退 勤'
      break;
    case '退室中':
      button_text = '出 勤'
      break;
    default:
      button_text = '出 退 勤'
  }
  // $('#set_attendance span').html('出 退 勤')
  $('#set_attendance span').html(button_text)
}
function resizeTextarea() {
  setTimeout(function () {
    $('textarea').css({'height':'auto'})
  }, 800);
}
