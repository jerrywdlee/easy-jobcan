
/*  */
$(document).on("pageinit", "#topPage", function(){
  /* データがない場合の対応 */
  if (!(localStorage['company_id']&&localStorage['email']&&localStorage['password']&&localStorage['server_url'])) {
    $('button.at-btn').prop("disabled", true)
    $('#work_status').hide()
    setTimeout(function () {
      $('#setting').click()
    }, 100);
  } else {
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

$(document).on("pageinit", "#setInfoPage", function(){
  $('#company_id').val(localStorage['company_id'])
  $('#email').val(localStorage['email'])
  $('#password').val(localStorage['password'])
  $('#server_url').val(localStorage['server_url'])
})

/* 主逻辑 */
$(document).ready(function(){
  /* 打刻 */
  $('#set_attendance').on('click', function () {
    alert(this)
  })
  /* 残業申請 */
  $('#set_over_work').on('click', function () {
    localStorage.setItem('over_work_hour',$('#over_work_hour').val())
    localStorage.setItem('over_work_min',$('#over_work_min').val())
    alert(this)
  })
  $('#save_info').on('click', function () {
    if ($('#company_id').val()&&$('#email').val()&&$('#password').val()&&$('#server_url').val()) {
      localStorage.setItem('company_id',$('#company_id').val())
      localStorage.setItem('email',$('#email').val())
      localStorage.setItem('password',$('#password').val())
      localStorage.setItem('server_url',$('#server_url').val())
      alert('保存しました！')
      $('button.at-btn').prop("disabled", false)
    } else {
      alert('データ不完全！')
    }
  })
})

function updateAttrStatus() {
  $('#work_status').html('勤怠ステータス取得中...').show()
}