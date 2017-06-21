import fetch from 'isomorphic-fetch'

export const getToy = (toy) => {
    return {
        type: 'GETTOY',
        text: toy
    }
};


export const fetchGetToy = (access_token) => {
    return (dispatch) => {
        return fetch(`https://yufaapi.xlhb.com/v1/sandbox/thumbnail-new-list.api`,{
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
                    let data = json.data;
                    // console.log(data);
                    // console.log(data['交通工具']);
                    dispatch(getToy(data));
                }else {
                    if(json.code == 401) {
                        let url_prop = document.querySelector('#root').getAttribute('data-url');
                        PRODUCTION ? window.location.href = url_prop + '/site/login.html':window.location.href = 'http://localhost:8080/login.html';
                    }
                    console.log(json.msg);
                }
            });
    }
};