import React, {Component} from 'react';
import { connect } from 'react-redux';
import {fetchSubmitBtn} from '../../actions/finishAction';


class submit extends React.Component {
    constructor(props) {
        super(props);
        Object.assign(this, {props});
    }
    submit_btn(){
        //获取时间
        document.querySelector('.wait').style.display = 'block';
        document.querySelector('.wait_size').style.display = 'block';
        document.querySelector('.wait_size_text').innerHTML = '报告提交中，请稍候...';
        window.endTime = Math.round((Date.parse(new Date()))/1000);
        let time = {
            "begintime": window.startTime,
            "overtime": window.endTime
        };
        //获取问题结果childNodes
        let answer = {
            "answer1": this.props.value.refs.one.value,
            "answer2": this.props.value.refs.two.value,
            "answer3": this.props.value.refs.three.value,
            "answer4": this.props.value.refs.four.value,
            "answer5": this.props.value.refs.five.value,
            "answer6": this.props.value.refs.six.value
        };
            if (navigator.onLine) {
                document.querySelector('.wait').style.display = 'block';
                document.querySelector('.wait_size').style.display = 'block';
                this.props.dispatch(fetchSubmitBtn(sessionStorage.access_token,time,answer));
            } else {
                document.querySelector('.wait').style.display = 'block';
                document.querySelector('.wait_size').style.display = 'block';
                document.querySelector(".wait_size_text").innerText = "哎呀！网络开小差啦~请检查网络连接";
                document.querySelector(".err_wait_btn").style.display = "block";
            }
    }
    render() {
        return (
            <div>
                <input
                    type="submit"
                    className="sub_bnt"
                    onClick = {this.submit_btn.bind(this)}
                    value=''
                />
            </div>
        )
    }
}

submit = connect()(submit);
export default submit