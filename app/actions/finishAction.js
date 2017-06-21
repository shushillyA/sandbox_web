import fetchHelper from '../lib/fetchHelper'

export const fetchSubmitBtn = (access_token,time,answer,imageList,model)=>{
    return (dispatch)=>{
        return fetchHelper.fetch(`https://yufaapi.xlhb.com/v1/sandbox/bs-upload-report.api`,{
            access_token:access_token,
            version:0,
            weidu1:time,
            weidu2:answer,
            weidu3:{ts_sign:"sandplay_screenshot"},
            weidu7:{ts_sign: "sandplay_video"}
        })
            .then((json) =>{
                console.log(json);
                if(json.code === 0){
                    document.querySelector(".wait_size").innerText = "您已提交成功，正在退出账号";
                    setTimeout(function () {
                        let url_prop = document.querySelector('#root').getAttribute('data-url');

                        PRODUCTION ? window.location.href = url_prop + '/site/login.html':window.location.href = 'http://localhost:8080/login.html';
                        console.log(json.msg);
                        window.Y_top = 0;
                    },1000)
                }else {
                    document.querySelector(".wait").style.display = "none";
                    document.querySelector(".wait_size").innerText = "提交失败，请稍候重试";
                    console.log(json.msg);
                }
            })
    }
};