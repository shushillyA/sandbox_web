// import React from 'react'
// import { connect } from 'react-redux'
// import {fetchLogin,userNameVerify,passwordVerify} from '../actions/loginAction'
//
// class LoginForm extends React.Component{
//     constructor(props){
//         super(props)
//         Object.assign(this,{props})
//         this.handleSubmit = this.handleSubmit.bind(this)
//     }
//     componentDidMount() {
//         this.timer = setTimeout(function () {
//             let h = document.documentElement.clientHeight;
//             let form_bg = this.refs.formBg;
//             let form_top = this.refs.formTop;
//             let form = this.refs.form;
//             // console.log(form_bg);
//             form_bg.style.width = (h-950)/2 +650 +'px';
//             form_bg.style.height = (h-950)/2 +480 +'px';
//
//             form_top.style.width = (h-950)/2 +446 +'px';
//             form_top.style.height = (h-950)/8 +124 +'px';
//             form_top.style.lineHeight = (h-950)/8 +124 +'px';
//             form_top.style.fontSize = (h-950)/20 + 55 +'px';
//             if(h < 700){
//                 this.refs.submitBtn.style.bottom = '8%';
//                 form.style.fontSize = '20px';
//                 form_bg.style.width = '515px';
//                 form_bg.style.height = '345px';
//                 this.refs.label.style.marginTop = 0;
//                 this.refs.label.childNodes[3].style.marginTop = '5px';
//             }else if(h < 780){
//                 this.refs.firstLabel.style.marginTop = '16%';
//                 this.refs.submitBtn.style.bottom = '15%';
//                 form.style.fontSize = (h-950)/24 + 32 +'px';
//                 this.refs.label.style.marginTop = 0;
//                 this.refs.label.childNodes[3].style.marginTop = (h-680)/8 + 5 + 'px';
//             }else if(h < 900) {
//                 form.style.fontSize = (h-950)/24 + 32 +'px';
//                 this.refs.submitBtn.style.bottom = '17%';
//                 this.refs.label.style.marginTop = 0;
//                 this.refs.label.childNodes[3].style.marginTop = (h-780)/8+ 5 +'px';
//             }
//             form_bg.style.backgroundSize =form_bg.style.width+" "+form_bg.style.height;
//
//         }.bind(this), 100);
//     }
//     handleSubmit(event){
//         event.preventDefault()
//         this.props.dispatch(fetchLogin(this.id.value,this.pw.value))
//     }
//     blurN () {
//         this.props.dispatch(userNameVerify(this.id.value))
//     }
//     blurP () {
//         this.props.dispatch(passwordVerify(this.pw.value))
//     }
//     render(){
//         return (
//             <div className="form-bg" ref="formBg">
//                 <div className="form-title" ref="formTop">电子沙盘</div>
//                 <form onSubmit={this.handleSubmit} ref="form">
//
//                     <label ref="firstLabel">
//                         I　D:<input type="text" placeholder="请输入用户名" className="userName" ref={(id)=>this.id=id} onChange={this.blurN.bind(this)}/>
//                         <br/>
//                         <span className="verify">{this.props.login.usernameVerify}</span>
//                     </label>
//                     <label className="pwdLabel" ref="label">
//                         密码:<input type="password" placeholder="请输入密码" className="margin_l passWord" ref={(pw)=>this.pw=pw} onChange={this.blurP.bind(this)}/>
//                         <br/>
//                         <span className="verify">{this.props.login.passwordVerify}</span>
//                     </label>
//                     <input type="submit" value='' className="login_btn" ref="submitBtn"/>
//                     <br/>
//                     <span className="verify">{this.props.login.err}</span>
//                 </form>
//             </div>
//
//         )
//     }
// }
//
// const mapStateToProps = (state) => ({
//     login:state.login
// })
//
// LoginForm = connect(mapStateToProps)(LoginForm)
//
// export default LoginForm