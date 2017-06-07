import React, { Component } from 'react';

class Repeat extends React.Component{
    constructor({dispatch}) {
        super();
        this.dispatch = dispatch;
    }
    render(){
        return(
            <div className="video">
                <div className="logo"></div>
                <div className="cloud"></div>
                <div className="cloud_right"></div>
                <div className="content">
                    <div className="top popup_top">
                        沙盘录像
                    </div>
                    <div className="play"></div>
                    <div className="explain">
                        <p>播放录像说明:</p>
                        1.点击“选取文件”按钮选择文件后缀名为“.ezr”格式的文件; <br/>
                        2.点击上方的播放按钮进行播放录制好的沙盘操作视频。
                    </div>
                </div>
                <p className="foot_font">Copyright ©   上海心灵伙伴览育  版权所有</p>
            </div>

        )
    }
}

export default Repeat