//软键盘
document.addEventListener('touchstart',function () {
    $(document).ready(function(){
        //获取焦点清除验证信息
        $("#username").focus(function(){
            $(".input_username").hide();
        });
        $("#password").focus(function(){
            $(".input_password").hide();
        });
        //按键回车enter点击提交
        $(document).keyup(function(event){
            if(event.keyCode == "13"){
                formSubmit(event);
            }
        });
        function tag(input) {
            VirtualKeyboard.toggle(input, 'softkey');
            $('#kb_langselector,#kb_mappingselector,#copyrights').css('display', 'none');
        }
        document.querySelector('#userName').onfocus = function () {
            tag('userName');
        };
        document.querySelector('#userName').onblur = function () {
            tag('userName');
        };
        document.querySelector('#userPWD').onfocus = function () {
            tag('userPWD');
        };
        document.querySelector('#userPWD').onblur = function () {
            tag('userPWD');
        };
        document.querySelector('#softkey').style.left = '50%';
        document.querySelector('#softkey').style.transform = 'translateX(-50%)';
        document.querySelector('#softkey').style.bottom = '-150px';
    });
});

var h = document.documentElement.clientHeight;
var form_bg = document.querySelector('.form-bg');
var form_top = document.querySelector('.form-title');
var form = document.querySelector('.form');
var label = document.querySelector('label');
var firstLabel = document.querySelector('.firstLabel');
var login_btn = document.querySelector('.login_btn');
var verify = document.querySelector('.verify ');
var query = document.querySelector('.query');

// console.log(form_bg);

form_bg.style.width = (h - 950) / 2 + 650 + 'px';
form_bg.style.height = (h - 950) / 2 + 450 + 'px';
form_top.style.height = (h - 950) / 8 + 100 + 'px';
form_top.style.lineHeight = (h - 950) / 8 + 100 + 'px';
form_top.style.fontSize = (h - 950) / 20 + 46 + 'px';

//控制登录窗口打小
if (h < 700) {
    form_top.style.width =
    login_btn.style.bottom = '8%';
    form.style.fontSize = '20px';
    form_bg.style.width = '515px';
    form_bg.style.height = '345px';
    label.style.marginTop = '16%' ;
    label.childNodes[1].style.marginTop = '5px';
    form_top.style.width = 300 + 'px';
    verify.style.bottom = '-40%';
    query.style.bottom = '3%'
} else if (h < 780) {
    firstLabel.style.marginTop = '16%';
    login_btn.style.bottom = '10%';
    form.style.fontSize = (h - 950) / 24 + 32 + 'px';
    label.style.marginTop = '12%' ;
    label.childNodes[1].style.marginTop = (h - 680) / 8 + 5 + 'px';
    form_top.style.width = 320 + 'px';
    verify.style.bottom = '-40%';
} else if (h < 900) {
    form.style.fontSize = (h - 950) / 24 + 32 + 'px';
    login_btn.style.bottom = '10%';
    label.style.marginTop = '18%';
    label.childNodes[1].style.marginTop = (h - 780) / 8 + 5 + 'px';
    form_top.style.width = 350 + 'px';
    verify.style.bottom = '-40%';
}

form_bg.style.backgroundSize =form_bg.style.width+" "+form_bg.style.height;
var userN = document.querySelector('.userName');
var passW = document.querySelector('.passWord');
sessionStorage.setItem('isTouch',"false");
document.addEventListener('touchstart',function () {
    sessionStorage.setItem('isTouch',"true");
    console.log(sessionStorage.isTouch);
});

//防止多次点击登陆
var isSort = true;
//创建ajax函数
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

function post(){
    isSort = false;
    console.log(isSort);
    var req = createXMLHTTPRequest();
    var postData = {
        "platform":"sandbox_web",
        "username":userN.value,
        "password":passW.value
    };
    postData = (function(obj){ // 转成post需要的字符串.
        var str = "";
        for(var prop in obj){
            str += prop + "=" + obj[prop] + "&"
        }
        return str;
    })(postData);
    if(req){
        req.open("POST", "https://api.xlhb.com/v1/user/login.api", true);
        req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
        req.send(postData);
        req.onreadystatechange = function(){
            document.querySelector('.err').innerHTML = '正在跳转，请耐心等待';
            document.querySelector('.err').style.display = 'block';
            document.querySelector('.query').style.display = 'none';
            if(req.readyState == 4){
                if(req.status == 200){
                    var user = req.responseText;
                    user = JSON.parse(user);
                    if(user.code == 0) {
                        document.cookie = 'access_token=' + user.data.access_token;
                        sessionStorage.setItem('access_token',user.data.access_token);
                        window.location.href='loading.html';
                        isSort = true;
                    }else {
                        document.querySelector('.err').innerHTML = '用户名或密码错误';
                        document.querySelector('.err').style.display = 'block';
                        document.querySelector('.query').style.display = 'block';
                        isSort = true;
                    }
                }else{
                    document.querySelector('.err').innerHTML = '网络异常，请稍后重试';
                    isSort = true;
                }
            }
        }
    }
}

var formSubmit = function(event){
    event.preventDefault();
    if(isSort) {
        if(isSort) {
            if(passW.value === '' && userN.value === '') {
                document.querySelector('.err').innerHTML = '请填写用户名和密码';
                document.querySelector('.err').style.display = 'block';
                document.querySelector('.query').style.display = 'block';
            }else if(passW.value !== '' && userN.value === '') {
                document.querySelector('.err').innerHTML = '请填写用户名';
                document.querySelector('.err').style.display = 'block';
                document.querySelector('.query').style.display = 'block';
            }else if(passW.value == '' && userN.value !== '') {
                document.querySelector('.err').innerHTML = '请填写密码';
                document.querySelector('.err').style.display = 'block';
                document.querySelector('.query').style.display = 'block';
            }else if(passW.value !== '' && userN.value !== '') {
                document.querySelector('.err').innerHTML = '正在验证，请耐心等待';
                document.querySelector('.err').style.display = 'block';
                document.querySelector('.query').style.display = 'none';
                post();
            }

        }
    }
};

var tishi = function () {
    document.querySelector('.form-bg').style.display = 'block';
    document.querySelector('.popup').style.display = 'none';
};

window.onload=function(){
    function isIE() {
        if (!!window.ActiveXObject || "ActiveXObject" in window || navigator.userAgent.indexOf('Firefox') >= 0 || navigator.userAgent.indexOf('Opera') >= 0)
            return true;
        else
            return false;
    }
    if(isIE()) {
        document.querySelector('.form-bg').style.display = 'none';
        document.querySelector('.popup').style.display = 'block';
    }
};
var urls = [
    'dist/img/loading.jpg',
    'dist/img/loading_help.png',
    'dist/img/help_bg_touch.png',
    'dist/img/ul01.png',
    'dist/img/ul02.png',
    'dist/img/ul03.png',
    'dist/img/ul04.png',
    'dist/img/ul05.png',
    'dist/img/ul06.png',
    'dist/img/ul07.png',
    'dist/img/ul08.png',
    'dist/img/ul09.png',
    'dist/img/ul10.png',
    'dist/img/ul11.png',
    'dist/img/ul12.png',
    'dist/img/ul13.png',
    'dist/img/scene.png',
    'dist/img/select.png',
    'dist/img/operation.png',
    'dist/img/draw.png',
];
var i = 0, j = 0, loadingPercent;
loading_bar = function () {
    var bar_width = Math.round(j / (urls.length) * 100);
    var oScript = document.createElement('script');
    loadingPercent = bar_width.toFixed(0) + '%';
    oScript.type = 'text/javascript';
};

//预加载
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