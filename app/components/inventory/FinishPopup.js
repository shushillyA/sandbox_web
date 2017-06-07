import React, {Component} from 'react';
import Close from '../Close';
import Submit from './Submit';

class finishPopup extends React.Component {
    constructor(props) {
        super(props);
        Object.assign(this, {props});
        this.keyEnter = this.keyEnter.bind(this);
    }
    finishBlock() {
        this.refs.mainCover.style.display = 'block';
        this.refs.finishBg.style.display = 'block';
    }
    //按回车下一input获取光标
    keyEnter(event,input) {
        // console.log(event.keyCode);
        if (event.keyCode == 13) {
            this.refs[input].focus();
        }
    }

    hid() {
        this.refs.wait.style.display = 'none'
        this.refs.err_wait_btn.style.display = 'none'
        this.refs.net_wait_btn.style.display = 'none'
    }
    render() {
        return (
            <div className="main_cover" ref="mainCover">
                <div className="wait" ref="wait">
                    <div className="wait_size" ref="wait">
                        <span className="wait_size_text" ref="wait_size_text">
                            报告提交中，请稍候
                        </span>
                        <input
                            type="submit"
                            className="err_wait_btn"
                            ref="err_wait_btn"
                            value=''
                            onClick={this.hid.bind(this)}
                        />
                        <input
                            type="submit"
                            className="net_wait_btn"
                            ref="net_wait_btn"
                            value=''
                            onClick={this.hid.bind(this)}
                        />
                    </div>
                </div>
                <div className="finish_bg set_bg" ref="finishBg">
                    <div className="popup_top finish_top">
                        评价
                    </div>
                    <div className="finish_content" ref={(data)=>this.data=data}>
                        <div className="comment comment_g" ref="comment">
                            <span className="m_t">1.最合适这个作品的名字是什么？</span>
                            <input type="text"  name="one" id="one" className="comment1 comment_g one color" ref="one"onKeyDown={(event) => this.keyEnter(event,'two')}/>
                            <span className="m_t">2.作品中有没有代表“你”的玩具？如果有的话,是哪一个？</span>
                            <input type="text" name="two" id="two" className="comment1 comment_g two color" ref="two" onKeyDown={(event) => this.keyEnter(event,'three')} />
                            <span className="m_t">3.对你最有意义的玩具是哪个？</span>
                            <input type="text" name="three" id="three" className="comment1 comment_g three color" ref="three" onKeyDown={(event) => this.keyEnter(event,'four')}/>
                            <span className="m_t">4.你最喜欢的玩具是哪个？</span>
                            <input type="text" name="four" id="four"  className="comment1 comment_g four color" ref="four" onKeyDown={(event) => this.keyEnter(event,'five')}/>
                            <span className="m_t">5.还有没有其他你想说明一下含义的玩具？如果有的话,能说说看么？</span>
                            <textarea name="five" id="five" className="comment2  comment_g five color" contentEditable="true" ref="five"></textarea>
                            <span className="m_t">6.说说你在游戏中的感受？</span>
                            <textarea name="six" id="six" type="text" className="comment2 comment_g six color" contentEditable="true" ref="six"/> <br/>
                            <Submit value={this}/>
                        </div>
                    </div>
                    <Close/>
                </div>
                <div id="softkey"></div>
            </div>
        )
    }
}

export default finishPopup
