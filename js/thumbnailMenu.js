/*
*   缩略图切换 首页和尾页单独考虑，中间页规律为 index * 2
*   last ：上一张
*   len: 总的缩略图数
*
* */
//缩略图点击

$('.page').each(function (index, item) {
    $('.page').eq(index).bind('click', function (ev) {
        if( index == 0) {
            $('.page').eq(last).removeClass('select-active')
            last = 0
            currentPage = 1
            $(this).addClass('select-active')
            $('#flipbook').turn('page', currentPage)
        } else if (index === len-1) {
            $('.page').eq(last).removeClass('select-active')
            last = len-1
            currentPage = pages
            $(this).addClass('select-active')
            $('#flipbook').turn('page', currentPage)
        } else if (index > 0 && index < len-1) {
            $('.page').eq(last).removeClass('select-active')
            last = index
            currentPage = last*2
            $(this).addClass('select-active')
            $('#flipbook').turn('page', currentPage)
        }
    })
})
//缩略图上一张
$('.thumbnail-menu .left-btn img').bind('click', function (ev) {
    thumbnailChange('left')
})


//缩略图下一张
$('.thumbnail-menu .right-btn img').bind('click', function (ev) {
    thumbnailChange('right')
})
