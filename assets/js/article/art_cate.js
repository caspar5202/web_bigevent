$(function () {

    const layer = layui.layer
    const form = layui.form

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                const htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    // 为添加类别按钮绑定点击事件
    let indexAdd = null
    $('#btn_add_cate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
        })
    })

    //通过代理的形式，为 form_add 表单绑定 submit 事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg('新增分类失败！')
                initArtCateList()
                layer.msg('新增分类成功！')
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式 为 btn_edit 绑定事件
    let indexEdit = null
    $('tbody').on('click', '.btn_edit', function () {
        // 弹出一个层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog_edit').html()
        })

        const id = $(this).attr('data-id')
        // 发起 Ajax 请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: res => {
                form.val('form_edit', res.data)
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form_edit', e => {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn_delete', function () {
        const id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: res => {
                    if (res.status !== 0) return layer.msg('删除分类失败！')
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })

})