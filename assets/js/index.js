$(function () {
    // 调用函数，获取用户的基本信息
    getUserInfo()

    // 点击按钮，实现退出功能
    $('#btn_logout').on('click', () => {
        const layer = layui.layer
        // 弹出退出提示框
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1、清空本地存储中 token
            localStorage.removeItem('token')
            //2、重新跳转登陆页面
            location.href = './login.html'

            layer.close(index)
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败！')
            renderAvatar(res.data)
        }
        // // 不论成功还是失败，都会调用 complete 回调函数
        // complete: (res) => {
        //     // complete 中可以使用 responseJSON 拿到服务器响应的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1、强制清空 token
        //         localStorage.removeItem('token')
        //         // 2、强制跳转登录页
        //         location.href = './login.html'
        //     }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1、获取用户名称
    let name = user.nickname || user.username
    //  2、设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3、头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text_avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        // 获取用户名的第一个大写字母
        const first = name[0].toUpperCase()
        $('.text_avatar').html(first).show()
    }
}