import { browserHistory } from 'react-router';
import fetch from 'isomorphic-fetch'
export const fetchExit = (access_token)=>{
    return (dispatch)=>{

        return fetch(`https://yufaapi.xlhb.com/v1/user/logout.api`,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body:`access_token=${access_token}`
        })
            .then(response => response.json())
            .then((json) =>{
                if(json.code == 0){
                    console.log(json.msg);
                    let url_prop = document.querySelector('#root').getAttribute('data-url');
                    PRODUCTION ? window.location.href = url_prop + '/site/login.html':window.location.href = 'http://localhost:8080/login.html';
                }else {
                    console.log(json.msg);
                    console.log(json.code);
                }
            })
    }
}