$(function () {
    const form = layui.form
    const layer = layui.layer

    form.verify({
        nickname: function (value) {
            if (value.length > 6) return '昵称必须在 1 ~ 6 个字符之间！'
        }
    })

    initUserInfo()

    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: res => {
                if (res.status !== 0) return layer.msg('获取用户信息失败')
                // console.log(res);
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单数据
    $('#btn_reset').on('click', e => {
        e.preventDefault()

        initUserInfo()
    })

    // 监听表单提交
    $('.layui-form').on('submit', e => {
        e.preventDefault()
        
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg('更新用户信息失败')
                layer.msg('更新用户信息成功！')

                // 调用父页面中的方法，重新渲染页面
                window.parent.getUserInfo()
            }
        })
    })

})