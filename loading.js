var PC_ele = `<div class="loading_help">
                    <div class="help_audio top_pc">
                        <audio src="./music/help.ogg" controls id="audio" autoplay></audio>
                        <div class="play" id="play"></div>
                        <div class="audio_bar">
                            <div class="music_bar"></div>
                            <div class="audio_button">
                                <span class="percent">0%</span>
                            </div>
                        </div>
                    </div>
        <span class="arrows_left"></span>
        <div class="help_box">
            <ul class="help_ul">
                <li class="scene" id="li"></li>
                <li class="select"></li>
                <li class="operation"></li>
                <li class="draw"></li>
            </ul>
            <ul class="sign">
                <li class="current"></li>
                <li class="all"></li>
                <li class="all"></li>
                <li class="all"></li>
            </ul>
        </div>
        <span class="arrows_right"></span>
    </div>`;
var touch_ele = `<div class="help_bg_touch">
                    <div class="help_audio top_touch">
                        <audio src="./music/help.ogg" controls id="audio" autoplay></audio>
                        <div class="play" id="play"></div>
                        <div class="audio_bar">
                            <div class="music_bar"></div>
                            <div class="audio_button">
                                <span class="percent">0%</span>
                            </div>
                        </div>
                    </div>
                    <div class="help_top">
                        操作帮助
                    </div>
                    <div class="ul_bg">
                        <ul class='touch_ul'>
                            <li class='touch_li'>
                                <div class="help_title">·沙具柜·</div>
                                <img src="../../../img/ul01.png" alt=""/>
                                <div class="help_check">查看模具</div>
                                <div class="help_font">左右滑动模具，查看分类中所有模型</div>
                            </li>
                            <li>
                                <div class="help_title">·沙具柜·</div>
                                <img src="../../../img/ul02.png" alt=""/>
                                <div class="help_check">沙具的选择</div>
                                <div class="help_font">点击选择沙具移动至沙盘</div>
                            </li>
                            <li>
                                <div class="help_title">·沙具柜·</div>
                                <img src="../../../img/ul03.png" alt=""/>
                                <div class="help_check">取消选择</div>
                                <div class="help_font">点击模具以外的地方取消选择</div>
                            </li>
                            <li>
                                <div class="help_title">·模具·</div>
                                <img src="../../../img/ul04.png" alt=""/>
                                <div class="help_check">选择模具</div>
                                <div class="help_font">长按沙盘中沙具，至可操作状态，再次长按可切换状态</div>
                            </li>
                            <li>
                                <div class="help_title">·模具·</div>
                                <img src="../../../img/ul05.png" alt=""/>
                                <div class="help_check">模具的移动</div>
                                <div class="help_font">一个手指移动模具至沙盘中任何地方</div>
                            </li>
                            <li>
                                <div class="help_title">·模具·</div>
                                <img src="../../../img/ul06.png" alt=""/>
                                <div class="help_check">模具的旋转</div>
                                <div class="help_font">旋转状态下，左右滑动</div>
                            </li>
                            <li>
                                <div class="help_title">·模具·</div>
                                <img src="../../../img/ul07.png" alt=""/>
                                <div class="help_check">模具的高度调整</div>
                                <div class="help_font">旋转状态下，上下滑动</div>
                            </li>
                            <li>
                                <div class="help_title">·模具·</div>
                                <img src="../../../img/ul08.png" alt=""/>
                                <div class="help_check">模具的放大缩小</div>
                                <div class="help_font">两个手指拉近或拉远</div>
                            </li>
                            <li>
                                <div class="help_title">·模具·</div>
                                <img src="../../../img/ul09.png" alt=""/>
                                <div class="help_check">取消模具</div>
                                <div class="help_font">五个手指点击模具其余地方</div>
                            </li>
                            <li>
                                <div class="help_title">·模具·</div>
                                <img src="../../../img/ul10.png" alt=""/>
                                <div class="help_check">删除模具</div>
                                <div class="help_font">点击模具操作状态中的删除按钮</div>
                            </li>
                            <li>
                                <div class="help_title">·绘制水·</div>
                                <img src="../../../img/ul11.png" alt=""/>
                                <div class="help_check">启动绘制水模式</div>
                                <div class="help_font">点击绘制水按钮</div>
                            </li>
                            <li>
                                <div class="help_title">·擦除水·</div>
                                <img src="../../../img/ul12.png" alt=""/>
                                <div class="help_check">擦除水</div>
                                <div class="help_font">点击擦除水按钮</div>
                            </li>
                            <li>
                                <div class="help_title">·沙盘视角·</div>
                                <img src="../../../img/ul13.png" alt=""/>
                                <div class="help_check">旋转沙盘</div>
                                <div class="help_font">以一个手指作为中心点，另一个手指做旋转操作</div>
                            </li>
                        </ul>
                        <span class="left"></span>
                        <span class="right"></span>
                        <dl>
                            <dt class="cur_help"></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                        </dl>
                    </div>
                </div>`;


if(sessionStorage.isTouch == "true") {
    var number = 0;
    var isSort = true;
    document.querySelector('.loading').innerHTML = touch_ele;
    document.querySelector('.right').onclick = function () {
        if(isSort){
            let li_width = document.querySelector('.touch_li').clientWidth + 2.4;
            let cur_w = li_width;
            if(number < 12){
                number++;
                document.querySelector('.left').style.background = 'url("images/arrows_left.png")';
                if(number == 12){
                    document.querySelector('.right').style.background = 'url("images/arrows_right_n.png")';
                }
                isSort = false;
                let lis = document.querySelectorAll('dt');
                for(let i = 0; i <= lis.length - 1; i ++){
                    lis[i].className = 'all';
                }
                lis[number].className = 'cur_help';
                cur_w = cur_w*(number);
                document.querySelector('.touch_ul').style.left = (-cur_w-1) + 'px';
                setTimeout(function () {
                    isSort = true;
                },800)
            }
        }
    }
    document.querySelector('.left').onclick = function () {
        if(isSort){
            let li_width = document.querySelector('.touch_li').clientWidth + 2.4;
            let cur_w = li_width;
            if(number > 0){
                document.querySelector('.right').style.background = 'url("images/arrows_right.png")';
                if(number == 1){
                    document.querySelector('.left').style.background = 'url("images/arrows_left_n.png")';
                }
                isSort = false;
                number--;
                let lis = document.querySelectorAll('dt');
                for(let i = 0; i <= lis.length - 1; i ++){
                    lis[i].className = 'all';
                }
                lis[number].className = 'cur_help';
                cur_w = cur_w*(number);
                document.querySelector('.touch_ul').style.left = (-cur_w) + 'px';
                setTimeout(function () {
                    isSort = true;
                },800)
            }
        }
    }
}else {
    document.querySelector('.loading').innerHTML = PC_ele;
    var w = document.documentElement.clientWidth;
    var door= document.querySelector('.door');
    var font = document.querySelector('.loadingFont');
    var over = document.querySelector('.loadingOver');
    var access = document.querySelector('.access');
    document.querySelector('#li').style.width = '24.5%';

    var loading_help = document.querySelector('.loading_help');

    var isSort = true;
    var num = 0;
    var help_w = w*0.667;
    var help_h = help_w/3.565;
    if(w >= 1260) {
        loading_help.style.width = help_w + 'px';
        loading_help.style.height = help_h + 'px';
    }else {
        loading_help.style.width =  '840px';
        loading_help.style.height = '236px';
    }
    if(w < 1200){
        font.style.right = "-18%";
        over.style.right = "-18%";
        door.style.right = "-34%";
        access.style.right = "-34%";
    } else if (w < 1600) {
        font.style.right = "-14%";
        over.style.right = "-14%";
        door.style.right = "-28%";
        access.style.right = "-28%";
    }else {
        font.style.right = "-10%";
        over.style.right = "-10%";
        door.style.right = "-22%";
        access.style.right = "-22%";
    }
    var li_width = document.querySelector('#li').clientWidth;
    var cur_w = li_width;
    document.querySelector('.arrows_left').onclick = function () {
        if(isSort){
            if(cur_w > li_width){
                document.querySelector('.arrows_right').style.background = 'url("images/arrows_right.png")';
                if(cur_w == 2*li_width){
                    document.querySelector('.arrows_left').style.background = 'url("images/arrows_left_n.png")';
                }
                isSort = false;
                num--;
                var lis = document.querySelectorAll('.sign li');
                for(var i = 0; i <= lis.length - 1; i ++){
                    lis[i].className = 'all';
                }
                lis[num].className = 'current';
                cur_w-=li_width;
                document.querySelector('.help_ul').style.transition = 'left 1s';
                document.querySelector('.help_ul').style.left = (-cur_w+li_width) + 'px'
                setTimeout(function () {
                    isSort = true;
                },1000)
            }
        }
    };
    document.querySelector('.arrows_right').onclick = function () {
        if(isSort){
            if(cur_w < 4*li_width){
                document.querySelector('.arrows_left').style.background = 'url("images/arrows_left.png")';
                if(cur_w == 3*li_width){
                    document.querySelector('.arrows_right').style.background = 'url("images/arrows_right_n.png")';
                }
                isSort = false;
                num++;
                var lis = document.querySelectorAll('.sign li');
                for(var i = 0; i <= lis.length - 1; i ++){
                    lis[i].className = 'all';
                }
                lis[num].className = 'current';
                cur_w+=li_width;
                document.querySelector('.help_ul').style.transition = 'left 1s';
                document.querySelector('.help_ul').style.left = (-cur_w+li_width) + 'px';
                setTimeout(function () {
                    isSort = true;
                },1000)
            }
        }
    };
}


var urls = [
    'dist/img/categoryBg.png',
    'dist/img/help_bg.png',
    'dist/img/categoryBg.png',
    'dist/img/cloud.png',
    'dist/img/exit.png',
    'dist/img/exit_bg.png',
    'dist/img/false.png',
    'dist/img/finish.png',
    'dist/img/finish_btn.png',
    'dist/img/help.png',
    'dist/img/help_bg.png',
    'dist/img/inventoryFrame.png',
    'dist/img/lock.png',
    'dist/img/musicClose.png',
    'dist/img/true.png',
    'dist/img/finish_btn.png',
    'dist/img/tijiao.png',
    'dist/img/err_wait_btn.png',
    'assets/texture/draw.png',
    'assets/texture/sand.jpg',
    'assets/texture/selectedSign.png',
    'assets/texture/wall/room_nx.jpg',
    'assets/texture/wall/room_ny.jpg',
    'assets/texture/wall/room_nz.jpg',
    'assets/texture/wall/room_px.jpg',
    'assets/texture/wall/room_py.jpg',
    'assets/texture/wall/room_pz.jpg'
];
function createXMLHTTPRequest() {
    var xmlHttpRequest;
    if (window.XMLHttpRequest) {
        //针对FireFox，Mozillar，Opera，Safari，IE7，IE8
        xmlHttpRequest = new XMLHttpRequest();
        //针对特定版本的mozillar浏览器的BUG进行修正
        if (xmlHttpRequest.overrideMimeType) {
            xmlHttpRequest.overrideMimeType("text/xml");
        }
    }
    return xmlHttpRequest;
}
var moveX = 0,
    btn_clickX ,
    self,
    percent = 0;

document.querySelector('.audio_button').addEventListener('pointerdown',function (event) {
    event = event || window.event;
    btn_clickX = event.clientX - moveX;
    self = event.srcElement ? event.srcElement : event.target;
    document.addEventListener('pointermove',audio_btn_move,false);
    document.addEventListener('pointerup',() => {
        //清空move效果
        document.removeEventListener('pointermove',audio_btn_move);
    },false);
},false);
var audio = document.querySelector('audio');
var audio_btn_move = function(event) {
    event = event || window.event;
    moveX = event.clientX - btn_clickX;
    if(moveX < 0) {
        moveX = 0;
        audio.currentTime = 0;
    }
    if(moveX > 410) {
        moveX = 410;
        audio.currentTime = audio.duration;
    }

    document.querySelector('.audio_button').style.left = moveX + 'px';
    document.querySelector('.music_bar').style.width = moveX + 'px';
    console.log(percent);
    document.querySelector('.percent').innerHTML = percent + '%';
    audio.currentTime = (moveX/410) * audio.duration
};

document.querySelector('#play').className="pause";
var timer_percent = setInterval(function () {
    if(Math.ceil(( audio.currentTime/audio.duration)*100)) {
        document.querySelector('.percent').innerHTML = Math.ceil(( audio.currentTime/audio.duration)*100) + '%'
    }else {
        document.querySelector('.percent').innerHTML = '0%';
    }

    document.querySelector('.audio_button').style.left = (audio.currentTime/audio.duration)*410 + 'px';
    window.moveX = (audio.currentTime/audio.duration)*410;
    document.querySelector('.music_bar').style.width = (audio.currentTime/audio.duration)*410 + 'px';
},100)
document.querySelector('#play').onclick = function () {
    clearInterval(timer_percent);
    if(document.querySelector('audio').paused){
        document.querySelector('#play').className="pause";
        document.querySelector('audio').play();
        //将音乐时间、进度条数据同步

        timer_percent = setInterval(function () {
            if(Math.ceil(( audio.currentTime/audio.duration)*100)) {
                document.querySelector('.percent').innerHTML = Math.ceil(( audio.currentTime/audio.duration)*100) + '%'
            }else {
                document.querySelector('.percent').innerHTML = '0%';
            }
            document.querySelector('.percent').innerHTML = Math.ceil(( audio.currentTime/audio.duration)*100) + '%'
            document.querySelector('.audio_button').style.left = (audio.currentTime/audio.duration)*410 + 'px';
            window.moveX = (audio.currentTime/audio.duration)*410;
            document.querySelector('.music_bar').style.width = (audio.currentTime/audio.duration)*410 + 'px';
        },100)
    }else{
        clearInterval(this.timer_percent);
        document.querySelector('#play').className="play";
        document.querySelector('audio').pause();
    }
};

var fetchGetToy = function() {
    var req = createXMLHTTPRequest();
    var postData = {
        "access_token": sessionStorage.access_token
    };
    postData = (function(obj){ // 转成post需要的字符串.
        var str = "";
        for(var prop in obj){
            str += prop + "=" + obj[prop] + "&"
        }
        return str;
    })(postData);
    console.log(postData);
    if(req){
        req.open("POST", "https://yufaapi.xlhb.com/v1/sandbox/thumbnail-new-list.api", true);
        req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
        req.send(postData);
        req.onreadystatechange = function(){
            if(req.readyState == 4){
                if(req.status == 200){
                    var data = req.responseText;
                    data = JSON.parse(data);
                    if(data.code == 0) {
                        for(var key in data.data) {
                            var name1 = data.data[key]
                            for(var name in name1) {
                                urls.push(name1[name].list_img + '')
                            }
                        }
                    }else {

                    }
                }else{

                }
            }
        }
    }
};
fetchGetToy()



// var loading_bar_width = document.querySelector('.loading_bar').clientWidth;
 // console.log(loading_bar_width);
 loading_bar = function () {
    var oBody = document.body;
    var bar_width = Math.round(j / (urls.length) * 100);
    var oScript = document.createElement('script');
    loadingPercent = bar_width.toFixed(0) + '%';
    // console.log(loadingPercent)
    oScript.type = 'text/javascript';
    oScript.innerHTML = "loading('"  + loadingPercent +  "');";
    oBody.appendChild(oScript);
    document.querySelector('.bar').style.width = bar_width.toFixed(0) + '%';
    document.querySelector('.num').textContent = bar_width.toFixed(0) + '%';
     if(j === 5 ) {
         var script2 = document.createElement('script');
         script2.src = 'app/lib/vender.js';
         document.body.appendChild(script2);
     }
     if(j === 10 ) {
         var script3 = document.createElement('script');
         script3.src = 'dist/js/bundle.js';
         document.body.appendChild(script3);
         var link = document.createElement('link');
         link.href = 'dist/css/main.css';
         link.rel="stylesheet";
         document.head.appendChild(link);
     }
};
var i = 0, j = 0, loadingPercent;
var callback = function () {
    // alert('完成')
    document.querySelector('.loadingFont').style.display = 'none';
    document.querySelector('.loadingOver').style.display = 'block';
    window.location.href='index.html';
};
var loading = function () {
    if (i == urls.length) {
        return;
    }
    console.log(i);
    var img = new Image();
    img.onload = function () {
        console.log(j);
        if (++j == urls.length) {
            console.log(j);
            loading_bar();
            callback();
        } else {
            //百分比
            loading_bar();
            loading();
        }
    };
    img.src = urls[i];
    ++i;
};
loading();
