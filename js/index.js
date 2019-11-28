    var bookWidth  = window.innerWidth * 0.75; //初始宽度
    var bookHeight = window.innerHeight * 0.91; //初始高度
    var minWidth  = window.innerWidth * 0.75; //初始宽度
    var minHeight = window.innerHeight * 0.91; //初始高度
    var magnifiedbookWidth = bookWidth * 1.25  // 放大镜下的宽度
    var magnifiedbookHeight = bookHeight * 1.25// 放大镜下的高度
    var translX = 0;
    var translY = 0;
    var last = 0; // 0 - 3
    var len = $('.page').length
    var timeId;
    var pages;
    var currentPage = 1; // 1-6
    var ifOpenVoice = true //声音图标
    var ifDrag = true // 拖动
    var ifFullScreen = false //全屏
    var ifshowthumbnail = true // 缩略图
    var ifmagnify = true // 放大缩小
    var ifextendedBarShow = false;
    var multiple = .2 // + -初始比例
    var ifChangeTop = false // 放大时缩小距顶部的值
    var audio = document.querySelector('audio')
    var prevTime =  new Date() * 1 // 用于节流
    var inputPage = $('.page-input').val()


    function jieliu(){
        var currentTime = new Date() * 1
        if ( currentTime - prevTime < 400) {
            return false
        }
        prevTime = currentTime
        return true
    }
    function resetSize() {
        bookWidth  = window.innerWidth * 0.75;
        bookHeight = window.innerHeight * 0.91;
        magnifiedbookWidth = bookWidth * 1.25
        magnifiedbookHeight = bookHeight * 1.25
        minWidth  = window.innerWidth * 0.75;
        minHeight = window.innerHeight * 0.91;
        if (window.innerWidth > 800 && window.innerWidth < 1000) {
            bookWidth  = 700
            bookHeight = window.innerHeight * 0.8;
            minWidth  = 700
            minHeight = window.innerHeight * 0.8;

        }
        if (window.innerWidth <= 800) {
            bookWidth  = window.innerWidth * 0.9;
            bookHeight = window.innerHeight * 0.8;
            magnifiedbookWidth = bookWidth * 1.25
            magnifiedbookHeight = bookHeight * 1.25
            minWidth  = window.innerWidth * 0.9;
            minHeight = window.innerHeight * 0.8;
        }
        $("#flipbook").turn("size", minWidth, minHeight);
        ifChangeTop = false
        console.log("onresize执行了")
        backPosition()
    }
    //书籍自动归位
    function backPosition() {
        // console.log("backPosition执行了")
        $('.flipbook-container').css('left', 50 + '%')
        $('.flipbook-container').css('top', 56 + 'px')
        if (window.innerWidth < 1000) {
            $('.flipbook-container').css('top', 80 + 'px')
        }
        if (ifChangeTop) {
            $('.flipbook-container').css('transform', 'translateY(-60px)')
            translY = -60
        } else {
            $('.flipbook-container').css('transform', 'translateY(-5px)')
            translY = -5
        }
        if (currentPage == 1) {//首页时距离为3/4*width
            translX = -(3/4*bookWidth)
            $('.flipbook-container').css('transform', 'translateX('+(-3/4*bookWidth)+'px)')
            return
        }
        if (currentPage == pages) { //尾页时距离为1/4*width
            translX = -(1/4*bookWidth)
            $('.flipbook-container').css('transform', 'translateX('+(-1/4*bookWidth)+'px)')
            return
        }
        if (currentPage > 1 && currentPage < pages){//中间页时距离为1/2*width
            translX = -(1/2*bookWidth)
            $('.flipbook-container').css('transform', 'translateX('+(-1/2*bookWidth)+'px)')
        }



    }
    // 放大缩小时书籍位置的重新计算
    function flipBookMoveAndScale(bookWidth, bookHeight) {
        backPosition()
        setTimeout(function () {
            $("#flipbook").turn("size", bookWidth, bookHeight);
        }, 100)
    }
    function next() {
        if (jieliu()) {
            // if (ifOpenVoice && currentPage < pages) {
            //     audio.play()
            // }

            if (currentPage <= pages) {
                $("#flipbook").turn('next')
                currentPage = $('#flipbook').turn('view')[0]
                if (currentPage === 6)  {
                    $('.page-input').val(currentPage  + "/" + pages)
                    $('.thumbnail-page-number').text(currentPage  + "/" + pages)
                    return
                }
                $('.page-input').val(currentPage + "-" + (currentPage + 1)  + "/" + pages)
                $('.thumbnail-page-number').text(currentPage + "-" + (currentPage + 1)  + "/" + pages)
                backPosition()
            } else if (currentPage+2 > pages) {
                console.log(122)
                $('.end-page-tip').css({
                    'opacity': .6,
                    'visibility': 'visible'
                })
                if (timeId) clearTimeout(timeId)
                timeId = setTimeout(function () {
                    $('.end-page-tip').css({
                        'opacity': 0,
                        'visibility': 'hidden'
                    })
                },600)
            }
        }


   }
    function prev() {
        if (jieliu()) {
            if (currentPage > 0) {
                $("#flipbook").turn('previous')
                currentPage = $('#flipbook').turn('view')[0] // 页数更新
                if (currentPage === 0)  {
                    currentPage++
                    $('.page-input').val(currentPage  + "/" + pages)
                    $('.thumbnail-page-number').text(currentPage  + "/" + pages)
                    backPosition()
                    return
                }
                backPosition()
                $('.page-input').val(currentPage + "-" + (currentPage + 1)  + "/" + pages)
                $('.thumbnail-page-number').text(currentPage + "-" + (currentPage + 1)  + "/" + pages)

            } else if (currentPage-1 <= 0) {
                $('.first-page-tip').css({
                    'opacity': .6,
                    'visibility': 'visible'
                })
                if (timeId) clearTimeout(timeId)
                timeId = setTimeout(function () {
                    $('.first-page-tip').css({
                        'opacity': 0,
                        'visibility': 'hidden'
                    })
                },600)
            }
        }
    }
    function FullScreen(el) {
        $('.full-btn img').attr('src', 'images/noFull.png')
        var isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        if (!isFullscreen) { //进入全屏,多重短路表达式
            (el.requestFullscreen && el.requestFullscreen()) ||
            (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
            (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el.msRequestFullscreen && el.msRequestFullscreen());
            bookWidth  = window.innerWidth * 0.75;
            bookHeight = window.innerHeight * 0.91;
            $("#flipbook").turn("size", bookWidth, bookHeight);
            ifFullScreen = true
            if (timeId) clearTimeout(timeId)
            timeId = setTimeout(function () {
                $('.watch-full').hide()
            },3000)
            $('.watch-full').text('退出全屏')

            backPosition()
        } else { //退出全屏,三目运算符
            ifFullScreen = true
            $('.watch-full').text('点击查看全屏')
            $('.full-btn img').attr('src', 'images/fullScreen.png')
            document.exitFullscreen ? document.exitFullscreen() :
                document.mozCancelFullScreen ? document.mozCancelFullScreen() :
                    document.webkitExitFullscreen ? document.webkitExitFullscreen() : '';
        }
    }
    function toggleFullScreen() {
        var el = document.body
        FullScreen(el);
    }
    function thumbnailChange(dir) {
        if ( dir === 'left') {
            if ( (last - 1) === 0) {
                if (ifOpenVoice) audio.play()
                $('.page').eq(last).removeClass('select-active')
                last = 0
                currentPage = 1
                $('.page').eq(last).addClass('select-active')
                prev()
                $('.thumbnail').css('left', 30 + 'px')
            } else if ((last - 1) > 0 && (last - 1) < len - 1) {
                $('.page').eq(last).removeClass('select-active')
                last--
                currentPage = last*2
                $('.page').eq(last).addClass('select-active')
                prev()
            }
            return
        }
        if (dir === 'right') {
            if ((last + 1) === len - 1) {
                    if (ifOpenVoice) audio.play()
                $('.page').eq(last).removeClass('select-active')
                last = len-1
                currentPage = pages
                $('.page').eq(last).addClass('select-active')
                next()
                $('.thumbnail').css('left', -30 + 'px')
            } else if ((last + 1) > 0 && (last + 1) < len - 1) {
                $('.page').eq(last).removeClass('select-active')
                last++
                currentPage = last*2
                $('.page').eq(last).addClass('select-active')
                next()
            }
        }

}
    // function searchShow(ev) {
    //     $('.search-menu').css({
    //         'left': 10 + 'px',
    //         'visibility':  'visible',
    //         'opacity': 1,
    //     })
    //     $('.search-input').val($('.preSearch').val())
    //     searchResult(ev)
    // }
    // function searchResult(ev) {
    //     ev = ev || window.event
    //     //   todo 发送aja请求
    //
    //     $('.search-content .result').html(
    //          '页数: <span class="page-number">0</span>'
    //         )
    //
    // }
    function bookloading() {
        setTimeout(function (){
            $('.contanier').show()
            $('body').css("background", 'url("./images/bg.jpg") no-repeat center/100% 100%')
            audio.muted = false
        },2000)
    }
//loading
bookloading()


// 导入书籍
+function  addPage (imgPathList) {
    var len = imgPathList.length
    var innerHTML = ''
    for( var i = 0; i < len; i++) {
        if( (i+1 )=== 1 || (i+1) === 2 || (i+2) === 1 || (i+1) === len ) {
            innerHTML +='<div class="hard" style="background:url('+imgPathList[i]+') no-repeat center/100% 100%;"></div>'
        } else {
            innerHTML += '<div  style="background:url('+imgPathList[i]+') no-repeat center/100% 100%; "></div>'
        }
    }
    $('#flipbook').html(innerHTML)
}([
    ' pages/01.jpg',
    ' pages/02.jpg',
    ' pages/03.jpg',
    ' pages/04.jpg',
    ' pages/05.jpg',
    ' pages/06.jpg',
]);

// 配置选项
$("#flipbook").turn({
    width: bookWidth,
    height: bookHeight,
    display: 'double',
    gradients: true,
    duration: 500,
    elevation:50,
    autoCenter: true,
    acceleration: true, // 触摸设备硬件加速
    when: {
            turning: function () {
                if (ifOpenVoice) {
                    audio.play()
                }
            },
            //手势或非手势都会触发翻页
             turned: function(e, page) {
                var view = $("#flipbook").turn('view')[0] //当前页
                if (view === 0) {
                    $('.watch-full').show()
                    $('.watch-full').text("点击查看全屏")
                    setTimeout(function (){
                        $('.watch-full').hide()
                    }, 3000)
                    $('.page').eq(last).removeClass('select-active')
                    currentPage = 1
                    last = 0
                    $('.page-input').val(currentPage  + "/" + pages)
                    $('.thumbnail-page-number').text(currentPage  + "/" + pages)
                    $('.thumbnail').css('left', 30 + 'px')
                }else if (view === pages) {
                    $('.watch-full').hide()
                    $('.page').eq(last).removeClass('select-active')
                    currentPage = pages
                    last = len-1
                    $('.page-input').val(currentPage  + "/" + pages)
                    $('.thumbnail-page-number').text(currentPage  + "/" + pages)
                    $('.thumbnail').css('left', - 30 + 'px')
                } else if ( view > 0 && view < pages) {
                    $('.watch-full').hide()
                    $('.page').eq(last).removeClass('select-active')
                    currentPage = $("#flipbook").turn('view')[0]
                    last = currentPage/2
                    $('.page-input').val(currentPage + "-" + (currentPage + 1)  + "/" + pages)
                    $('.thumbnail-page-number').text(currentPage + "-" + (currentPage + 1)  + "/" + pages)
                }
                $('.page').eq(last).addClass('select-active')
                 backPosition()

            }
        }
});



pages = $("#flipbook").turn('pages')
currentPage = $('#flipbook').turn('view')[1]
$('.page-input').val(currentPage + "/" + pages)
$('.thumbnail-page-number').text(currentPage + "/" + pages)
resetSize()


//自动调整大小
window.onresize = function (ev) {
    resetSize()

}


//放大缩小
$('.magnify-btn').bind('click', function (ev) {
    if (ifmagnify) {
        ifmagnify = false
        ifChangeTop = true
        $('.margnify-text').text('缩小')
        $('.magnify-btn img').attr('src', 'images/shrink.png')
        $('.margnify-wrapper1 img').attr('src', 'images/shrink1.png')
        bookWidth = bookWidth* 1.25
        bookHeight = bookHeight* 1.25
        flipBookMoveAndScale(bookWidth, bookHeight)
        $('.scale-menu-wrapper').show()
        if (ifDrag) {
            dragEvent()
        } else {
            $('body').bind('mousemove')
        }
    } else {
        ifmagnify = true
        ifChangeTop = true
        bookWidth = minWidth
        bookHeight = minHeight
        addNum = 0
        $('.margnify-text').text('放大')
        $('.magnify-btn img').attr('src', 'images/magnify.png')
        $('.margnify-wrapper1 img').attr('src', 'images/magnify1.png')
        flipBookMoveAndScale(bookWidth, bookHeight)
        $('.scale-menu-wrapper').hide()
        $('.flipbook-container').unbind('mousedown')
        $('body').unbind('mousemove')
        $('body').unbind('mouseup')
        $('.flipbook-container').css({
            'top': 56 + 'px'
        })

    }
})

//缩略图
$('.thumbnail-btn').bind('click', function (ev) {
     if (ifshowthumbnail) {
         //设置所有图片高度为一个具体的固定值
         bookWidth = bookWidth*.85
         bookHeight = bookHeight*.85
         flipBookMoveAndScale(bookWidth, bookHeight)
         // $("#flipbook").turn("zoom",.5)
         $('.thumbnail-menu').css('bottom', 30 + 'px')
         ifshowthumbnail = false
     } else {
         // 还原高度为原来的值
         bookWidth = minWidth
         bookHeight = minHeight
         flipBookMoveAndScale(bookWidth, bookHeight)
         // $("#flipbook").turn("zoom",1)
         $('.thumbnail-menu').css('bottom', -180 + 'px')
         ifshowthumbnail = true
     }
})

//上一页
$('.pre-btn').bind('click', prev)
$('.btn-left').bind('click', prev)

//下一页
$('.next-btn').bind('click', next)
$('.btn-right').bind('click', next)


$(window).bind('keydown', function (ev) {
    ev = ev || event
    if (ev.keyCode == 37)
        $('#flipbook').turn('previous');
    else if (ev.keyCode == 39)
        $('#flipbook').turn('next');
});

//首页
$('.first-btn').bind('click', function () {

    currentPage = 1
    backPosition()
    $("#flipbook").turn('page', currentPage)
    $('.page-input').val(currentPage + "/" + pages)
    if (currentPage != 1 ) {
        audio.play()
    }
})

//末尾页
$('.last-btn').bind('click', function () {

    currentPage = pages
    backPosition()
    $('.page-input').val(currentPage + "/" + pages)
    $("#flipbook").turn('page', pages)


})

// 输入页数跳转
$('.page-input').bind('keydown', function (ev) {
    ev = ev || event
    if (ev.keyCode == 13) {
       var value = Number($('.page-input').val())
       if ( value > 0 && value <= pages) {
           $("#flipbook").turn("page",value)
           inputPage = $('.page-input').val()
       }
    }
})
$('.page-input').bind('blur', function (ev) {
        ev = ev || event
        var value = Number($('.page-input').val())
        if ( value > 0 && value < pages) {
            $("#flipbook").turn("page",value)
            inputPage = $('.page-input').val()
        } else {
            $('.page-input').val(inputPage)
        }

})
//分享
$('.share-btn').bind('click', function () {
    $('.share-box').addClass('show-active')
    $('.share-wrapper').addClass('show-active')


})

//关闭分享
$('.close-btn').bind('click', function () {
    $('.share-box').removeClass('show-active')
    $('.share-wrapper').removeClass('show-active')

})

//关闭分享
$('.share-wrapper').bind('click', function (ev) {
    var ev = event || ev
        console.log(ev.target.parentNode)
    ev.preventDefault()
    $('.share-box').removeClass('show-active')
    $('.share-wrapper').removeClass('show-active')
})

//自动播放
$('.play-btn').bind('click', function () {
    $('.play-btn img').attr('src', 'images/pause.png')
    if (timeId) clearTimeout(timeId)
    timeId = setInterval(function () {
        next()
        if (currentPage === 6) {
            $('.play-btn img').attr('src', 'images/play.png')
            clearTimeout(timeId)
        }
    }, 1000)
})

// 有声
$('.voice-btn').bind('click', function () {
    if (ifOpenVoice) {
        $('.voice-btn img').attr('src', "images/silence.png")
        ifOpenVoice = false
    } else {
        $('.voice-btn img').attr('src', "images/voice.png")
        ifOpenVoice = true
    }
})
// 全屏
$('.full-btn').bind('click', toggleFullScreen)

$('.watch-full').bind("click", function (ev) {
    if (ifFullScreen) {
        ifFullScreen = false
        $('.watch-full').text('点击查看全屏')
    } else {
        ifFullScreen = true
        $('.watch-full').text('退出全屏')
    }
    toggleFullScreen()
    if (timeId) clearTimeout(timeId)
    timeId = setTimeout(function () {
        $('.watch-full').hide()
    }, 3000)
})

// 右键菜单
$('body').bind('contextmenu', function (ev) {
    console.log(ev.button)
     ev = ev || window.event
     if (ev.button == 2) {
         ev.preventDefault();
         var x1 = ev.clientX,
             y1 = ev.clientY;
         $('.context-menu').css({
             'top' : y1 + 'px',
             'left': x1 + 'px',
             'display': 'block'
         })
     } else if (ev.button == 1){

         $('.context-menu').css({
             'display': 'none'
         })
     }
})
$('body').bind('click', function (ev) {

    $('.context-menu').hide()
    if (ev.target.getAttribute('data') != 'more') {
        $('.extendedBar').hide()
        ifextendedBarShow = false
    }
})
// 扩展
$('.init-menu .more-btn img') .bind('click', function (ev) {
    if (ifextendedBarShow) {
        $('.extendedBar').hide()
    } else {
        $('.extendedBar').show()
    }
    ifextendedBarShow = !ifextendedBarShow

})


//搜索
// $('.presearch-button').bind('click',function (ev) {
//     searchShow(ev)
// })
// $('.preSearch').bind('keydown',function (ev) {
//     ev = ev || event
//     if (ev.keyCode == 13) {
//         searchShow(ev)
//     }
// })



