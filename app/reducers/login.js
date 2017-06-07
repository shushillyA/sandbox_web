import { browserHistory } from 'react-router';

const login = (state={
    isRequest:false,
    isLogin:false,
    usernameVerify:'',
    passwordVerify:'',
    err:''
},action) =>{
    switch (action.type){
        case 'USERNAMEVERIFY':
            if(action.username == '')
                return {...state,usernameVerify:'用户名不能为空'}
            else return {...state,usernameVerify:''}
        case 'PASSWORDVERIFY':
            if(action.password == '')
                return {...state,passwordVerify:'密码不能为空'}
            else return {...state,passwordVerify:''}
        case 'LOGINERROR':
            return {...state,err:action.err}
        case 'LOGINSUCCESS':
            browserHistory.push('/game')
            return {...state,isLogin:true}
        default:
            return state
    }
}

export default login;