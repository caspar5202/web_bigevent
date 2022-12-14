$(function () {

    const layer = layui.layer
    const form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                const htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    const $image = $('#image')

    // 2. 裁剪选项
    const options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btn_choose_image').on('click', () => {
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取文件列表
    $('#coverFile').on('change', function (e) {
        const files = e.target.files[0]
        if (files.length === 0) return

        // 根据选择的文件，创建一个对应的 URL 地址
        const newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    const art_state = '已发布'

    // 为 存为草稿按钮绑定点击事件
    $('#btn_save2').on('click', () => {
        art_state = '草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#form_pub').on('submit', e => {
        e.preventDefault()
        const fd = new FormData($(this)[0])

        fd.append('state', art_state)

        // 将封面裁剪后的图片，输出为一个文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)

                publishArticle(fd)
            })
    })

    // 定义一个发表文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交 formdata 数据，必须有两个属性
            contentType:false,
            processDate:false,
            success: res => {
                if (res.status !== 0) return layer.msg('发表文章失败！')
                layer.msg('发表文章成功！')
                location.href = './article/art_list.html'
            }
        })
    }

})