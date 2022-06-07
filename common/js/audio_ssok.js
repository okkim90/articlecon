
        /* 리스트에서만 */
        var audios;
        console.log(audios);
        if(audios !== undefined){
            let total = 0;
            let total_min;
            let total_sec;
            let total_time;
            for(let i = 0; i <audios.length; i++ ){
                //console.log(audios[i].url);
                let time;
                let min;
                let sec;

                getDuration(audios[i].url, function(length) {
                    min = Math.floor(length/60);
                    sec = Math.floor(length%60);
                    if(min>0){
                        time = min +'분 ' + sec+'초';
                    }else{
                        time = sec+'초';
                    }
                    document.querySelectorAll('.audioDu')[i].textContent = "총 " + time;


                    total = total + Math.floor(length);
                    total_min = Math.floor(total/60);
                    total_sec = Math.floor(total%60);
                    if(total_min>0){
                        total_time = total_min +'분 ' + total_sec+'초';
                    }else{
                        total_time = total_sec+'초';
                    }

                    if(document.getElementById('total_playtime_box')){
                        document.getElementById('total_playtime_box').textContent = "총 " + total_time;
                    }
                });

            }
        }
        /* // 리스트에서만 */



        const audioPlayer = document.querySelector(".audio-player");
        const audio = new Audio();

        function getDuration(src, cb) {
            var audioDu = new Audio();
            $(audioDu).on("loadedmetadata", function(){
                cb(audioDu.duration);
            });
            audioDu.src = src;
        }

        //var networkState = audio.readystate;
        //console.log('networkState', networkState);

        var audioTime;
        audio.addEventListener("loadeddata",() => {
            audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
                audio.duration
            );
            audioTime =  audio.duration;
            console.log(audioTime);

            audio.volume = .75;

        }, false);


        $('.slider').slider({
            value: 0,
            step: 0.1,
            min: 0,
            range:"min",
            max: audioTime,
            slide: function( event, ui ) {
                //console.log(ui.value);
                console.log(ui.value);
                const timelineWidth = ui.value;
                const timeToSeek = ui.value / 100 * audio.duration;
                audio.currentTime = timeToSeek;

            },
        });

        //click volume slider to change volume
        const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
        const volume_txt = document.querySelector(".volume_txt");
        volumeSlider.addEventListener('click', e => {
            const sliderWidth = window.getComputedStyle(volumeSlider).width;
            const newVolume = e.offsetX / parseInt(sliderWidth);
            audio.volume = newVolume;

            //volume_txt.innerHTML = newVolume;

            audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
        }, false)

        //check audio percentage and update time accordingly

        const GV = {
            isPause: false,
            timer: null
        }
        const setTimer = function(){
            GV.isPause = false;
            GV.timer = setInterval(function(){
                /*
                const progressBar = audioPlayer.querySelector(".progress");
                progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
                */
                audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
                    audio.currentTime
                );

                //console.log(audio.currentTime);
                $('.slider').slider('value',audio.currentTime / audio.duration * 100);

            }, 10);
        };
        const stopTimer = function(){
            clearInterval(GV.timer);
            GV.isPause = true;
        };



        //toggle between playing and pausing on button click
        const playBtn = audioPlayer.querySelector(".controls .player_btn");
        playBtn.addEventListener("click",() => {
            if (audio.paused) {
                if(play_type == 'list'){
                    play();
                }else{
                    play_sep();
                }
            } else {
                pause();
            }
        },false);

        audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
            const volumeEl = audioPlayer.querySelector(".volume-container .volume");
            audio.muted = !audio.muted;
            if (audio.muted) {
                volumeEl.classList.remove("fa-volume-high");
                volumeEl.classList.add("fa-volume-xmark");
            } else {
                volumeEl.classList.remove("fa-volume-xmark");
                volumeEl.classList.add("fa-volume-high");
            }
        });

        //turn 128 seconds into 2:08
        function getTimeCodeFromNum(num) {
        let seconds = parseInt(num);
        let minutes = parseInt(seconds / 60);
        seconds -= minutes * 60;
        const hours = parseInt(minutes / 60);
        minutes -= hours * 60;

        if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
        return `${String(hours).padStart(2, 0)}:${minutes}:${String(
            seconds % 60
        ).padStart(2, 0)}`;
        }



        var currentVal = 0;
        var currentFile = "";
        var audioName = "";
        var play_speed = 1;
        var play_type;
        var like_status;
        var audio_like = document.getElementById('audio_like');
        function playAudio(val) {
            $('.audio_player').addClass('on');
            $('#content').addClass('audio_play');
            play_type = 'list';

            var url = audios[val].url;
            var name = audios[val].title;
            //console.log(name);
            var like = audios[val].like;

            if (url !== currentFile) {
                audio.src = url;
                audioName = name;
                currentFile = url;
                currentVal = val;

                //$('.name').text(audioName);
               if(like){
                    //console.log('true');
                    audio_like.checked = true
               }else{
                    //console.log('false');
                    audio_like.checked = false
               }
            }
            if (audio.paused) {
                //oAudio.play();
                audio.playbackRate = play_speed;
                play();

            }else{

                pause();
            }

            audio.onended = function(){

                if(currentVal < $('.audio_item').length -1){
                    currentVal += 1;
                    playBtn.classList.remove("pause");
                    playBtn.classList.add("play");
                    autoplay();
                }else{
                    playBtn.classList.remove("pause");
                    playBtn.classList.add("play");
                }
                $('.audio_item').removeClass('on');
            }
        }


        function playAudio_sep(target){
            $('.audio_player').addClass('on');
            $('#content').addClass('audio_play');
            play_type = 'oneonly';
            var $this = $(target);
            //var $audioData = $this.data('audio');
            var url = $this.data('url');
            var name = $this.data('name');
            var status = $this.data('status');
            var like = $this.data('like');
            //console.log(status);


            $('.audio_item').removeClass('current');
            $this.parents('.audio_item').addClass('current');
            if (url !== currentFile) {
                audio.src = url;
                audioName = name;
                currentFile = url;
                //currentVal = val;
                //$('.name').text(audioName);
                if(like){
                    //console.log('true');
                    audio_like.checked = true
                }else{
                    //console.log('false');
                    audio_like.checked = false
                }
            }else{


            }
            if (audio.paused) {
                //oAudio.play();
                audio.playbackRate = play_speed;
                play_sep();
            }else{
                pause();
            }

            audio.onended = function(){

                playBtn.classList.remove("pause");
                playBtn.classList.add("play");
                $('.audio_item').removeClass('on');

            }
        }


        function play(){

            if(audio.src){
                clearAutoplay();
                audio.play();
                playBtn.classList.add("pause");
                playBtn.classList.remove("play");

                $('.audio_item').removeClass('on');
                //$('.audio_item .btn').removeClass('on');
                $('.audio_item').eq(currentVal).addClass('on').find('.btn').addClass('on');
                $('.marquee_inner').html( audioName);
                $('#audio_tit').text(audioName);
                console.log(audioName);
                setTimer();
            }else{
                alert('오디오가 없습니다');
            }

        }

        function play_sep(){
            if(audio.src){
                audio.play();
                playBtn.classList.add("pause");
                playBtn.classList.remove("play");
                $('.audio_item').removeClass('on');
                $('.audio_item.current').addClass('on').find('.btn').addClass('on');
                $('.marquee_inner').html( audioName);
                $('#audio_tit').text(audioName);
                setTimer();


            }else{
                alert('오디오가 없습니다');
            }




        }



        function pause(){
            audio.pause();
            playBtn.classList.remove("pause");
            playBtn.classList.add("play");
            $('.audio_item').removeClass('on');
            stopTimer();


        }





        // 15초 뒤로
        function rewindAudio() {
            console.log(audio);
            if (window.HTMLAudioElement) {
                try {
                    audio.currentTime -= 15.0;
                    //console.log(audio.currentTime)
                    $('.slider').slider('value',audio.currentTime / audio.duration * 100);

                }
                catch (e) {
                    if(window.console && console.error("Error:" + e));
                }
            }
        }

        // 15초 앞으로
        function forwardAudio() {
            console.log(audio);
            if (window.HTMLAudioElement) {
                try {
                    audio.currentTime += 15.0;
                    //console.log(audio.currentTime)
                    $('.slider').slider('value',audio.currentTime / audio.duration * 100);
                }
                catch (e) {
                    if(window.console && console.error("Error:" + e));
                }
            }
        }


        // 정지
        function AudioStop()
        {
            //audio.Stop();
        }


        function speed(e){
            var $val = $(e).val();
            //console.log($val);
            play_speed = $val
            audio.playbackRate = play_speed;
        }


        var $autoplay;
        function autoplay(){
            $autoplay = setTimeout(function(){
                playAudio(currentVal);
            },1000);
        }
        function clearAutoplay(){
            clearTimeout($autoplay);
        }

        function player_max(){
            document.querySelector('.audio_player').classList.add('maximal');
            document.querySelector('.audio_player').classList.remove('minimal');
        }
        function player_min(){
            document.querySelector('.audio_player').classList.add('minimal');
            document.querySelector('.audio_player').classList.remove('maximal');
        }


