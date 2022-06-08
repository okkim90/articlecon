function SetNum(obj){
    val=obj.value;
    re=/[^0-9]/gi;
    obj.value=val.replace(re,"");
}

function zeroPad(src) {
    var args = arguments;
    var size = 2;
    if(args.length > 1) {
        size = args[1];
    }
    var strLen = (isNaN(src) ? src.length : src.toString().length);
    size -= strLen;
    var zero = "";
    for(var i=0; i < size; i++) {
        zero += "0";
    }
    return zero + src;
}

function dateFormat(date) {
    var args = arguments;
    var sep = "-";
    if(args.length > 1) {
        sep = args[1];
    }
    return date.getFullYear() + sep + zeroPad(date.getMonth() + 1) + sep + zeroPad(date.getDate());
}

$(function(){
    var $footer_policy = $('.footer_policy');
    $('.btn_policy').on('click',function(){
        if($footer_policy.hasClass('on')){
            $footer_policy.removeClass('on');
            $footer_policy.find('.txt_box').slideUp(200);
        }else{
            $footer_policy.addClass('on');
            $footer_policy.find('.txt_box').slideDown(200);
        }
    });



    winH();
    $(window).on('load resize scroll',function(){
        winH();
    });


    resizeCont();
    $(window).on('load resize',function(){
        resizeCont();
    });

    $(window).on('load',function(){
        if($('.audio_player').hasClass('on')){
            $('#content').addClass('audio_play');
        }else{
            $('#content').removeClass('audio_play');
        }
    });


    $('.toggle_tab').on('click',function(){
        var $tabs = $(this).parents('.select_sticker').find('.tabs');
        if($(this).hasClass('on')){
            $(this).removeClass('on');
            $tabs.removeClass('on');
        }else{
            $(this).addClass('on');
            $tabs.addClass('on');
        }
    });

    $('.tab_btn').on('click',function(){
        var $idx = $(this).index();
        //console.log($idx);
        $(this)
            .addClass('on')
            .siblings('.tab_btn')
            .removeClass('on');
        $(this)
            .parents('.tabs')
            .find('.sticker_set')
            .eq($idx)
            .addClass('on')
            .siblings('.sticker_set')
            .removeClass('on');
    });

    $('.btn_reply').on('click',function(){
        var $reply_set = $(this).parents('.comment_set').find('.comment_reply');
        if($reply_set.hasClass('on')){
            $reply_set.removeClass('on')
        }else{
            $reply_set.addClass('on')
        }

    });

    // 투표 최대갯수 제한 스크립트
    $('.checklist_limit').each(function(){
        var $checkbox = $(this).find('.checkbox_limit');
        var $limit = $(this).data('limit');
        $checkbox.on('change',function(){
            if($checkbox.filter(":checked").length > $limit){
                this.checked = false;
                alert('해당 투표항목은 최대 '+ $limit+ '개까지 선택할 수 있습니다.')
            }
        });
    })

    //투표 결과 프로그레스바 스크립트
    $('.progress_wrap').each(function(){
        var $progress = $(this).find('.progress');
        var $count = $(this).find('.progress .vote_count');
        var $total = 0;
        var $arrmap = [];
        for(var i=0;i<$progress.length;i++){
            var progress_val = parseInt($progress.eq(i).data('val'));
            $total += progress_val;
            $arrmap.push(progress_val);
        }
        var $max_val = Math.max.apply(Math, $arrmap);

        $(this).attr('data-total',$total);
        $progress.each(function(){
            var $this_val = $(this).data('val');
            var $percentage = ($this_val*100)/$total;
            var $vote_count = $(this).find('.vote_count');
            $(this).find('.bar').width(Math.round($percentage)+'%');
            $vote_count.text($this_val);
            if($this_val == $max_val){
                $(this).find('.bar').append('<span class="rank">1위</span>')
            }
        });

        var width_array = $count.map(function () {
            return $(this).width();
        }).get();

        var max_width = Math.max.apply(Math, width_array);
        $count.width(max_width);
    });


    //dep2메뉴 스크롤
    dep2Scroll();
    $(window).on('load resize',function(){
        dep2Scroll();
    });

    //토론결과
    discussionResult();

    //메인페이지 상단 리스트 스와이프
    initSwiper1('.card_list');

    //메인 파이차트+결과
    createChart();
});


function dep2Scroll(){
    if($('.menu_dep2_list').length > 0){
        var li_item = $('.menu_dep2_link.on').parents('.menu_dep2_item');
        var li_pos = li_item.position().left;
        //console.log(li_pos);
        $('.menu_dep2_list').animate({'scrollLeft':li_pos},0);
    }

}


function resizeCont(){
    let ovH = $('.oc_vid_area').outerHeight();
    $('.oc_list_area_inner').outerHeight(ovH);


    let mtvH = $('.main_tv_vid_area').outerHeight();
    $('.main_tv_list_area_inner').outerHeight(mtvH);
}


function winH(){
    $('.wihH').outerHeight($(window).height());
    $('.minWihH').css({'min-height':$(window).height() - 130});
}






//레이어 팝업 닫기
function close_popup(target){
    var $this = $(target);
    $this.parents('.layer_popup').removeClass('on');
}

//레이어 팝업 열기
function open_popup(target){
    let popupName = $(target).data('popup');
    $('.layer_popup.'+popupName).addClass('on');
}


//글자수 체크
function countChar(val,limit) {
    var len = val.value.length;
    if (len >= limit) {
        val.value = val.value.substring(0, limit);
        $(val).siblings('.limit_info').find('.current').html(limit);
    } else {
        $(val).siblings('.limit_info').find('.current').html(len);
    }
};


// 베스트 댓글 컨텐츠 토글버튼
function toggle_comment_cont(target){
    var $this = $(target);
    $this.parents('.comment_area_cont').toggleClass('on');
}

//콤마
function addComma(value){
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return value;
}

// 토론결과
function discussionResult(){
    if(document.querySelector('.vp_discussion_result')){
        let val_agree = parseInt(document.getElementById('agree_val').value);
        let val_disagree = parseInt(document.getElementById('disagree_val').value);
        let val_total = val_agree + val_disagree;
        let percent_agree = (val_agree*100)/val_total;
        let percent_disagree = (val_disagree*100)/val_total;

        let $bar_agree = document.getElementById('agree_progress');
        let $bar_disagree = document.getElementById('disagree_progress');
        let $percent_agree = document.getElementById('agree_percent');
        let $percent_disagree = document.getElementById('disagree_percent');
        let $count_agree = document.getElementById('agree_count');
        let $count_disagree = document.getElementById('disagree_count');

        $bar_agree.style.width = percent_agree+'%';
        $bar_disagree.style.width = percent_disagree+'%';

        $percent_agree.textContent = Math.round(percent_agree)+"%";
        $percent_disagree.textContent = Math.round(percent_disagree)+"%";

        $count_agree.textContent = addComma(String(val_agree))+" 명";
        $count_disagree.textContent = addComma(String(val_disagree))+" 명";
    }
}



/* 메인페이지 상단 리스트 스와이프 */
var mySwiper1 = undefined;
function initSwiper1(target) {
    let $this = $(target);
    let screenWidth = window.innerWidth;
    if(screenWidth <= 767 && mySwiper1 == undefined) {
        mySwiper1 = new Swiper(target, {
            slidesPerView: 1,
            speed: 600,
            loop: true,
            autoplay: {
                delay: 4500,
                disableOnInteraction: false,
            },
        });
    } else if (screenWidth > 767 && mySwiper1 != undefined) {
        mySwiper1.destroy();
        mySwiper1 = undefined;
        $this.find('.swiper-wrapper').removeAttr('style');
        $this.find('.swiper-slide').removeAttr('style');

    }
}

$(window).on('load resize', function(){
    initSwiper1('.card_list');
});
/* // 메인페이지 상단 리스트 스와이프 */




/* 메인페이지 파이차트 생성 + 결과 노출 스크립트 */
function createChart() {
    var colorArr = [],
        pieData = [],
        sectorAngleArr = [],
        percentArr = [],
        txtArr = [],
        svg = '<svg class="pie_svg" viewBox="0 0 400 400">',
        total = 0,
        startAngle = 0,
        endAngle = 0,
        x1 = 0,
        x2 = 0,
        y1 = 0,
        y2 = 0,
        percent = 0;
        result = '';

    // Get values of input boxes and store in pieData array
    $('.input-container input').each(function(){
        var value = parseInt($(this).val()); // make sure value is saved as an int
        pieData.push(value);
        total += value; // Adds all numbers to get the sum of all inputs

        var $color = $(this).data('color');
        colorArr.push($color);
        var $txt = $(this).data('txt');
        txtArr.push($txt);
    });

    // Get angles each slice swipes for sectorAngleArr
    for (var i = 0; i < pieData.length; i++) {
        var percentArr_item = Math.round(pieData[i] * 100 / total);
        percentArr.push(percentArr_item + "%" );

        var angle = Math.ceil(360 * pieData[i] / total);
        sectorAngleArr.push(angle);
    }

    for (var i = 0; i < percentArr.length; i++) {
        //document.querySelectorAll('.result_percent')[i].textContent  = percentArr[i];
        //var main_discussion_result =  document.querySelector('.main_discussion_result');
        var item = '<span class="main_discussion_result_item">'+
                        '<i style="background:'+ colorArr[i] +'"></i>'+
                        '<b class="result_percent" style="color:'+ colorArr[i] +'">'+percentArr[i]+'</b>'+
                        '<span>'+txtArr[i]+'</span>'+
                    '</span>';
        result += item;
    }

    for (var i = 0; i < sectorAngleArr.length; i++) {
        startAngle = endAngle;
        endAngle = startAngle + sectorAngleArr[i];

        // Check if the angle is over 180deg for large angle flag
        percent = endAngle - startAngle;


        var overHalf = 0;
        if (percent > 180) {
        overHalf = 1;
        }

        // Super fun math for calculating x and y positions
        x1 = 200 + 200 * Math.cos(Math.PI * startAngle / 180);
        y1 = 200 + 200 * Math.sin(Math.PI * startAngle / 180);

        x2 = 200 + 200 * Math.cos(Math.PI * endAngle / 180);
        y2 = 200 + 200 * Math.sin(Math.PI * endAngle / 180);

        var d = "M200,200  L" + x1 + "," + y1 + "  A200,200 0 " + overHalf + ",1 " + x2 + "," + y2 + " z";
        svg += '<path  d="' + d + '" style="fill: ' + colorArr[i] + ';" />';
    }

    // Close SVG
    svg += '</svg>';

    // Write html for SVG to the DOM
    $('#pie-chart').html(svg);

    $('.main_discussion_result').html(result);
}