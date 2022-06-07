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


    var mv = new Swiper('.mv',{
        speed:600,
        slidesPerView:3,
        loop:true,
        autoplay: {
            delay: 4500,
            disableOnInteraction:false
        },
        navigation: {
            nextEl: '.mv_next',
            prevEl: '.mv_prev'
        },
        pagination: {
            clickable:true,
            el: '.mv_pagination'
        },
        breakpoints: {
            1024: {
                slidesPerView:1
            }
        }

    });

    var audio_slide = new Swiper('.main_audio_slide',{
        slidesPerView:"auto",
        spaceBetween: 40,
        loop:true,
        speed: 600,
        freeMode: true,
        // autoplay: {
        //     delay: 4000,
        //     disableOnInteraction:false
        // },

        breakpoints: {
            1024: {

            },
            767: {
                spaceBetween: 20,

            }
        }
    });



    var article_slide = new Swiper('.main_article_slide',{
        slidesPerView: "auto",
        spaceBetween: 40,
        loop:true,
        speed: 600,
        //freeMode: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction:false
        },
        breakpoints: {
            1024: {

            },
            767: {
                spaceBetween: 20,
            }
        }
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

