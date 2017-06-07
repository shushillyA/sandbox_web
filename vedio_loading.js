let urls = [
    'http://localhost:8080/dist/img/categoryBg.png',
    'http://localhost:8080/dist/img/help_bg.png',
    'http://localhost:8080/dist/img/categoryBg.png',
    'http://localhost:8080/dist/img/cloud.png',
    'http://localhost:8080/dist/img/exit.png',
    'http://localhost:8080/dist/img/exit_bg.png',
    'http://localhost:8080/dist/img/false.png',
    'http://localhost:8080/dist/img/finish.png',
    'http://localhost:8080/dist/img/finish_btn.png',
    'http://localhost:8080/dist/img/help.png',
    'http://localhost:8080/dist/img/help_bg.png',
    'http://localhost:8080/dist/img/inventoryFrame.png',
    'http://localhost:8080/dist/img/lock.png',
    'http://localhost:8080/dist/img/musicClose.png',
    'http://localhost:8080/dist/img/true.png',
    'http://localhost:8080/texture/draw.png',
    'http://localhost:8080/texture/sand.jpg',
    'http://localhost:8080/texture/selectedSign.png',
    'http://localhost:8080/texture/wall/room_nx.jpg',
    'http://localhost:8080/texture/wall/room_ny.jpg',
    'http://localhost:8080/texture/wall/room_nz.jpg',
    'http://localhost:8080/texture/wall/room_px.jpg',
    'http://localhost:8080/texture/wall/room_py.jpg',
    'http://localhost:8080/texture/wall/room_pz.jpg'
];
let number = 0;
let loading_bar_width = document.querySelector('.loadingBar').clientWidth;
// console.log(loading_bar_width);
loading_bar = function () {
    let oBody = document.body;
    let bar_width = Math.round(j / (urls.length) * 100);
    let oScript = document.createElement('script');
    loadingPercent = bar_width.toFixed(0) + '%';
    // console.log(loadingPercent)
    oScript.type = 'text/javascript';
    oScript.innerHTML = "loading('"  + loadingPercent +  "');";
    oBody.appendChild(oScript);
    document.querySelector('.bar').style.width = (bar_width/100)*loading_bar_width + 'px';
    document.querySelector('.percent').textContent = bar_width.toFixed(0) + '%';
    if(j == urls.length-1 ) {
        //加载js
        let script = document.createElement('script');
        script.src = 'http://localhost:8080/dist/js/bundle.js';
        document.body.appendChild(script);
        //加载css
        let link = document.createElement('link');
        link.href = 'http://localhost:8080/dist/css/main.css';
        link.rel="stylesheet";
        document.head.appendChild(link);
    }
};
let i = 0, j = 0, loadingPercent;
let callback = function () {
    // alert('完成')
    // window.location.href='http://localhost:8080?page=game';
};
let loading = function () {
    if (i == urls.length) {
        return;
    }
    console.log(i);
    let img = new Image();
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