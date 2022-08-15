$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        const y = dt.getFullYear()
        const m = dt.getMonth() + 1
        const d = dt.getDate()

        const hh = dt.getHours()
        const mm = dt.getMinutes()
        const ss = dt.getSeconds()

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 定义一个查询的参数对象，将来请求数据
    let q = {
        pagenum: 1,     // 页码值
        pagesize: 2,    // 默认每页显示几条数据
        cate_id: '',    // 文章分类id
        state: ''       // 文章的发布状态
    }

    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面数据
                const html_str = template('tpl_table', res)
                $('tbody').html(html_str)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取分类信息失败！')
                }
                // 调用模板引擎渲染分类可选项
                const hemlStr = template('tpl_cate', res)
                $('[name=cate_id').html(hemlStr)
                // 通知 layui ，重新渲染表单区域的方法
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form_search').on('submit', e => {
        e.preventDefault()

        // 获取表单的值
        const cate_id = $('[name=cate_id]').val()
        const state = $('[name=state]').val()
        // 为查询参数对象 q 赋值
        q.cate_id = cate_id
        q.state = state

        // 根据最新的筛选条件，重新渲染
        initTable()
    })

    // 定义渲染页码方法
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'test1', //注意，这里的 test1 是 ID，不用加 # 号
            count: 5, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,    // 设置默认选择哪一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 6],
            // 分页发生切换的时候，发生 jump 回调
            jump: function (obj, first) {
                q.pagenum = obj.curr //得到当前页，以便向服务端请求对应页的数据。               
                q.pagesize = obj.limit
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 代理方式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn_delete', function () {
        const id = $(this).attr('data-id')
        // 获取删除按钮的个数
        const len = $('.btn_delete').length

        // 弹出层，询问是否删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: res => {
                    if (res.status != 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前页是否还有剩余的数据
                    if (len === 1) {
                        // 页码值最小是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })

})