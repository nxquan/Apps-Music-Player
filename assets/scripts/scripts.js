const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const heading = $('header h2');
const audio = $('#audio');

const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const cdThumbAnimation = cdThumb.animate([{
    transform: 'rotate(360deg)'
}], {
    duration: 10000,
    iterations: Infinity
});
cdThumbAnimation.pause();

const playAudioBtn = $('.btn-toggle-play');
const playerBlock = $('.player');
const progressBar = $('#progress');

const previousBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
/**
 * to do
 * 1. Render songs
 * 2. Scroll top
 * 3. play/pause/seek
 * 4. CD Rotate
 * 5. Next / Previous
 * 6. Random
 * 7. Next / Repeat when the song end
 * 8. 
 */

const app = {
    songs : [
        {
            name: 'Bỏ em vào Balo',
            singer: 'Tân Trần',
            path: './assets/music/song_1/Bo Em vao Balo - Tan Tran_ Freak D.mp3',
            image: './assets/images/song_1/song_1-img.jpg'
        },
        {
            name: 'Chúc vợ ngủ ngon',
            singer: 'Vũ Duy Khánh',
            path: './assets/music/song_2/ChucVoNguNgon-VuDuyKhanh.mp3',
            image: './assets/images/song_2/song_2-img.jpg'
        },
        {
            name: 'Đế vương',
            singer: 'Đình Dũng',
            path: './assets/music/song_3/DeVuong-DinhDungACV.mp3',
            image: './assets/images/song_3/song_3-img.jpg'
        },
        {
            name: 'Sài gòn đau lòng quá',
            singer: 'Hứa Kim Tuyền',
            path: './assets/music/song_4/SaiGonDauLongQua-HuaKimTuyenHoangDuyen.mp3',
            image: './assets/images/song_4/song_4-img.jpg'
        },
        {
            name: 'Thương em đến già',
            singer: 'Lê Bảo Bình',
            path: './assets/music/song_5/Thuong Em Den Gia - Le Bao Binh.mp3',
            image: './assets/images/song_5/song_5-img.jpg'
        },
        {
            name: 'Yêu đương khó quá thì về với anh',
            singer: 'Erik',
            path: './assets/music/song_6/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK.mp3',
            image: './assets/images/song_6/song_6-img.jpg'
        },
        {
            name: 'Kiếp này em gả cho anh',
            singer: 'Thái Học',
            path: './assets/music/song_7/Kiep-Nay-Em-Ga-Cho-Anh-Thai-Hoc.mp3',
            image: './assets/images/song_7/song_7-img.jpg'
        },
        {
            name: 'Cô độc vương',
            singer: 'Gumin',
            path: './assets/music/song_8/CoDocVuong-Gumin.mp3',
            image: './assets/images/song_8/song_8-img.jpg'
        },
        {
            name: 'Kẹo bông gòn',
            singer: 'H2KKN',
            path: './assets/music/song_9/KeoBongGon-H2KKN.mp3',
            image: './assets/images/song_9/song_9-img.jpg'
        },
        {
            name: 'Lưu số em đi',
            singer: 'Vũ Phùng Tiến',
            path: './assets/music/song_10/Luu So Em Di - Huynh Van_ Vu Phung Tien.mp3',
            image: './assets/images/song_10/song_10-img.jpg'
        }
    ],
    currentIndexSong: 0
    ,
    isPlaying: false
    ,
    isRandom: false
    ,
    isRepeat: false
    ,
    renderHTML: function(){
        const html = this.songs.map((song, index) =>{
            return `
                <div class="song" data-index = '${index}'>
                    <div class="thumb" style="background-image: url('${song.image}');"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = html.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndexSong];
            }
        });
    }
    ,
    handleEvents: function(){
        const _this = this;
        //Xử lý phóng to/thu nhỏ CD
        const cdWidth = cd.offsetWidth;
        document.onscroll = function(){
            const scrollX = window.scrollX || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollX;
            cd.style.width = newCdWidth > 0 ? (newCdWidth + 'px') : (0 + 'px');
            cd.style.opacity =  newCdWidth/cdWidth > 0 ? newCdWidth/cdWidth: 0 ;
        }
        
        //Xử lý khi click play Audio
        playAudioBtn.onclick = function(){
            //Kiểm tra có đang play hay không?
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
            //DOM Events trong Audio
            audio.onplay = function(){
                playerBlock.classList.add('playing');
                _this.isPlaying = true;
                cdThumbAnimation.play(); //Xử lý CD Rotate
            }
            audio.onpause = function(){
                playerBlock.classList.remove('playing');
                _this.isPlaying = false;
                cdThumbAnimation.pause(); //Xử lý CD Rotate
            }
            audio.ontimeupdate = function(){
                let progressPercent = Math.floor(audio.currentTime / audio.duration*100);
                progressBar.value = progressPercent;
            }
        }
        //Xử lý khi tua song
        progressBar.onchange = function(e){
            let seekTime =  (e.target.value * audio.duration) / 100;
            audio.currentTime = seekTime;
        }
        //Xử lý chuyển songs
        previousBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.toPreviousSong();
            }
            audio.play();
            _this.isPlaying = true;
            playerBlock.classList.add('playing');
            cdThumbAnimation.play();
            _this.scrollToActiveSong();
        }
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.toNextSong();
            }
            audio.play();
            _this.isPlaying = true;
            playerBlock.classList.add('playing');
            cdThumbAnimation.play();
            _this.scrollToActiveSong();
        }
        //Xử lý random songs
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom;
            this.classList.toggle('active', _this.isRandom);
        }
        //Xử lý next song khi audio end
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        //Xử lý lặp lại song
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle('active', _this.isRepeat);
        }
        //Xử lý lắng nghe khi click vào playlist
        playlist.onclick = function(e){
            let songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                //Xử lý khi click vào song
                if(songNode){
                    _this.currentIndexSong = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                }
                if(e.target.closest('.option')){
                    
                }
            }
        }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.background = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
        this.hightlightSong();
    },
    toPreviousSong: function(){
        this.currentIndexSong--;
        if(this.currentIndexSong < 0){
            this.currentIndexSong = this.songs.length - 1;
        }
        this.loadCurrentSong();
        this.hightlightSong();
    },
    toNextSong: function(){
        this.currentIndexSong++;
        if(this.currentIndexSong >= this.songs.length){
            this.currentIndexSong = 0;
        }
        this.loadCurrentSong();
        this.hightlightSong();
    },
    playRandomSong: function(){
        let oldIndex = this.currentIndexSong;
        do {
            this.currentIndexSong = Math.floor(Math.random() * this.songs.length);
        }while(this.currentIndexSong ===  oldIndex);
        this.loadCurrentSong();
        this.hightlightSong();
    },
    hightlightSong: function(){
        let songBlock = $$('.song');
        for(var i = 0; i < songBlock.length; i++){
            songBlock[i].classList.remove('active');
        }
        songBlock[this.currentIndexSong].classList.add('active');
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 200);
    },
    start: function(){
        //Định nghĩa các Property cho Object app
        this.defineProperties();
        //Render songs HTML
        this.renderHTML();
        //Đinh nghĩa/Xử lý các events (DOM Events)
        this.handleEvents();
        //Tải bài hát hiện tại vào UI khi khởi động ứng dụng
        this.loadCurrentSong();
    }
}
app.start();