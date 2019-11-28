/*
*   缩放菜单的事件
*
* */

// +
var addNum = 0
$('.add-btn img').bind('click', function (ev) {
    addNum++
    bookWidth = magnifiedbookWidth * (1 + multiple*addNum)
    bookHeight = magnifiedbookHeight  * (1 + multiple*addNum)
    flipBookMoveAndScale(bookWidth, bookHeight )
})

// -
$('.minus-btn img').bind('click', function (ev) {
    addNum--
    if (addNum <= 0) {
        flipBookMoveAndScale(bookWidth, bookHeight )
        bookWidth = magnifiedbookWidth / 1.25
        bookHeight = magnifiedbookHeight  / 1.25
        $('.scale-menu-wrapper').hide()
        $('.magnify-btn img').attr('src', 'images/magnify.png')
        ifmagnify = true // 变为可放大状态
        ifChangeTop = false //top值变为 0
        $('body').unbind('mousemove')
    } else {
        bookWidth = magnifiedbookWidth * (1 + multiple*addNum)
        bookHeight = magnifiedbookHeight  * (1 + multiple*addNum)

    }
    flipBookMoveAndScale(bookWidth, bookHeight )

})

// 缩小
$('.shrink-btn img').bind('click', function (ev) {
    ifmagnify = true
    ifChangeTop = true
    bookWidth = minWidth
    bookHeight = minHeight
    addNum = 0
    $('.magnify-btn img').attr('src', 'images/magnify.png')
    flipBookMoveAndScale(bookWidth, bookHeight)
    $('.scale-menu-wrapper').hide()
    $('body').unbind('mousemove')
    $('.flipbook-container').css({
        'top':  56 + 'px'
    })
    dragEvent()
})




$('.mouse-btn img').bind('click', function (ev) {
    if (ifDrag) {
        // 移动状态下
        ifDrag = false
        $('.mouse-btn img').attr('src', 'images/hand.png')
        $('.flipbook-container').unbind('mousedown')
        $('body').unbind('mousemove')
        $('body').unbind('mouseup')
        var t = $('.flipbook-container').offset().top
        $('body').bind('mousemove', move)
    } else {
        // 拖拽状态下
        ifDrag = true
        $('.mouse-btn img').attr('src', 'images/mouse.png')
        $('body').unbind('mousemove')
        dragEvent()




    }

})

// 公式：原left + 变化位移 - translate的额外变化
function dragEvent() {
    //拖动
    $('.flipbook-container').bind('mousedown', function (ev) {
        if (ifmagnify && ifDrag) return
        var ev = ev || window.event
        var x1 = ev.clientX
        var y1 = ev.clientY
        var l = $('.flipbook-container').offset().left
        var t = $('.flipbook-container').offset().top
        $('body').bind('mousemove', function (ev) {
            var ev = ev || window.event
            var x2 = ev.clientX;
            var y2 = ev.clientY;
            var x = x2-x1  ;
            var y = y2-y1 ;
            var newT = y + t ;
            var newL = x + l - translX; //offsetLeft的值有一部分是transLatex产生的需剪掉这部分
            $('.flipbook-container').css({
                'top':  newT + 'px',
                'left': newL + 'px'
            })
        })
        $('body').bind('mouseup', function (ev) {
            var ev = ev || window.event
            $('body').unbind('mousemove')
            var minLeft = $('#flipbook').offset().left + bookWidth/2
            var maxRight = $('#flipbook').offset().left + bookWidth/2
            var minHeight = $('#flipbook').offset().top
            if (currentPage === 1 ){
                if ( minLeft < 0 || maxRight > window.innerWidth - 200) {
                    ifChangeTop = false
                    backPosition()
                }
            }

        })
    })
}

/*
    原插件规律
*   鼠标左右移动书籍方向相同
*   鼠标上下移动书记方向相反
*   原插件有做视图扫描，无论放大多少倍都能通过移动鼠标浏览每一处
*   技术原因没有做视图扫描，可以通过鼠标拖动同样能达到浏览全图每一处的效果
* */
function move (ev) {
    var t = $('.flipbook-container').offset().top
    var l = $('.flipbook-container').offset().left
    if (ifmagnify) {
        if (ifDrag) return
    }
    var ev = ev || window.event
    var x = ev.clientX;
    var y = ev.clientY;
    var newL = x - l
    var newT = y - t
    /*      视口的移动比例 和 图书的移动比例相同，可得:
    *       newT/window.innerHeight = t / bookHeight
    *       => t =newT * bookHeight/ window.innerHeight
    * */
    $('.flipbook-container').css({
        'left': newL * bookWidth / window.innerWidth + 'px' ,
        'top':  -(multiple * newT * bookHeight/ window.innerHeight) + 'px'
    })
}

dragEvent()
