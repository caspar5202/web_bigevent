$(function () {
  // 点击注册账号
  $('#link_reg').on('click', () => {
    $('.login_box').hide()
    $('.reg_box').show()
  })

  //点击 去登陆
  $('#link_login').on('click', () => {
    $('.login_box').show()
    $('.reg_box').hide()
  })

  // 从 layui 中获取 form 对象
  const form = layui.form
  const layer = layui.layer
  // 通过 form.verify() 函数自定义校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']
    // 校验密码是否一致
    ,repwd: function (value) {
      //通过形参拿到确认框值，和密码框值相比较
      const pwd = $('.reg_box [name=password]').val()
      if (pwd !== value) return '两次密码不一致！'
    }
  })


  // 监听注册表单的提交事件
  $('#form_reg').on('submit', e => {
    e.preventDefault()

    const data = {username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()}
    $.post('/api/reguser', data, res => {
      if (res.status !== 0) return layer.msg(res.message)
      layer.msg('注册成功！请登录')
      // 模拟人的点击行为
      $('#link_login').click()
    })
  })

  // 监听登录表单的提交事件
  $('#form_login').submit(function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/api/login',
      // 快速获取表单数据 .serialize()
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) return layer.msg('登录失败！')
        layer.msg('登录成功！')
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = './index.html'
      }
    })
  })

})