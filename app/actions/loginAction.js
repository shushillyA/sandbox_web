import fetch from 'isomorphic-fetch'

export const loginSuccess = ()=>{
    return{
        type:'LOGINSUCCESS'
    }
};

export const userNameVerify = (username)=>{
    return{
        type:'USERNAMEVERIFY',
        username
    }
};

export const passwordVerify = (password)=>{
    return{
        type:'PASSWORDVERIFY',
        password
    }
};

export const loginError = (err)=>{
    return{
        type:'LOGINERROR',
        err
    }
};

export const fetchLogin = (username,password)=>{
    return (dispatch)=>{
        return fetch(`https://api.xlhb.com/v1/user/login.api`,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body:`platform=sandbox_web&username=${username}&password=${password}`
        })
            .then(response => response.json())
            .then((json) =>{
                sessionStorage.setItem("access_token",json.data.access_token);
                switch (json.code){
                    case 0:
                        dispatch(loginSuccess())
                        break;
                    default:
                        dispatch(loginError('用户名或密码错误'))
                        break
                }
            })
            .catch(()=>{
                dispatch(loginSuccess())
            })
    }
};