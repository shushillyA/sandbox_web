import React, {Component} from 'react';
import Close from '../Close';

window.moveX = 0;
class helpPopup extends React.Component {
    constructor(props) {
        super(props)
        Object.assign(this, {props});
        this.close = this.close.bind(this);
        this.play = this.play.bind(this);
        this.audio_btn = this.audio_btn.bind(this);
        this.audio_btn_move = this.audio_btn_move.bind(this);
        this.isSort = true;
        this.number = 0;
        this.percent = 0;
    }
    componentDidMount() {
        this.refs.audio_button.setAttribute('touch-action', 'none');
        this.refs.audio_button.addEventListener('pointerdown', this.audio_btn, false);
    }
    left() {
        let li_width = this.refs.li.clientWidth;
        let cur_w = li_width;
        if(this.isSort){
            if(this.number > 0){
                this.refs.right.style.background = `url("${ASSETS}img/arrows_right.png")`;
                if(this.number == 1){
                    this.refs.left.style.background = `url("${ASSETS}img/arrows_left_n.png")`;
                }
                let _this = this;
                _this.isSort = false;
                this.number--;
                let lis = this.refs.dl.childNodes;
                for(let i = 0; i <= lis.length - 1; i ++){
                    lis[i].className = 'all';
                }
                lis[this.number].className = 'cur_help';
                cur_w = cur_w*(this.number);
                this.refs.ul.style.left = (-cur_w) + 'px';
                setTimeout(function () {
                    _this.isSort = true;
                },800)
            }
        }
    }
    right() {
        let li_width = this.refs.li.clientWidth;
        let cur_w = li_width;
        if(this.isSort){
            if(this.number < 12){
                this.refs.left.style.background = `url("${ASSETS}img/arrows_left.png")`;
                if(this.number == 11){
                    this.refs.right.style.background = `url("${ASSETS}img/arrows_right_n.png")`;
                }
                let _this = this;
                _this.isSort = false;
                this.number++;
                let lis = this.refs.dl.childNodes;
                for(let i = 0; i <= lis.length - 1; i ++){
                    lis[i].className = 'all';
                }
                lis[this.number].className = 'cur_help';
                console.log(lis[this.number]);
                cur_w = cur_w*(this.number);
                this.refs.ul.style.left = (-cur_w) + 'px';
                setTimeout(function () {
                    _this.isSort = true;
                },800)
            }
        }
    }
    helpBlock() {
        this.refs.mainCover.style.display = 'block';
        this.refs.helpBg.style.display = 'block';
    }

    close() {
        this.refs.mainCover.style.display = 'none';
        this.refs.helpBg.style.display = 'none';
    }
    play() {
        if(this.refs.audio.paused){
            this.refs.play.className="pause";
            this.refs.audio.play();
            //将音乐时间、进度条数据同步
            let _this = this;
            this.timer_percent = setInterval(() => {
                if(Math.ceil((_this.refs.audio.currentTime/_this.refs.audio.duration)*100)){
                    _this.refs.percent.innerHTML = Math.ceil((_this.refs.audio.currentTime/_this.refs.audio.duration)*100) + '%'
                }else {
                    _this.refs.percent.innerHTML = '0%'
                }
                _this.refs.audio_button.style.left = (_this.refs.audio.currentTime/_this.refs.audio.duration)*410 + 'px';
                window.moveX = (_this.refs.audio.currentTime/_this.refs.audio.duration)*410;
                _this.refs.bar.style.width = (_this.refs.audio.currentTime/_this.refs.audio.duration)*410 + 'px';
                if(_this.refs.audio.currentTime === _this.refs.audio.duration) {
                    _this.refs.play.className="play";
                    clearInterval(_this.timer_percent);
                }
            },100)
        }else{
            clearInterval(this.timer_percent);
            this.refs.play.className="play";
            this.refs.audio.pause();
        }
    }
    audio_btn (event){
        event = event || window.event;
        this.btn_clickX = event.clientX - moveX;
        this.self = event.srcElement ? event.srcElement : event.target;
        document.addEventListener('pointermove',this.audio_btn_move,false);
        document.addEventListener('pointerup',() => {
            //清空move效果
            document.removeEventListener('pointermove',this.audio_btn_move);
        },false);
    }



    audio_btn_move (event) {
        event = event || window.event;
        moveX = event.clientX - this.btn_clickX;
        if(moveX < 0) {
            moveX = 0;
            this.refs.audio.currentTime = 0;
        }
        if(moveX > 410) {
            moveX = 410;
            this.refs.audio.currentTime = this.refs.audio.duration;
            this.refs.play.className="play";
            this.refs.audio.pause();
        }

        this.refs.audio_button.style.left = moveX + 'px';
        this.refs.bar.style.width = moveX + 'px';
        this.percent = Math.ceil((window.moveX/410)*100);
        if( this.percent) {
            this.refs.percent.innerHTML = this.percent + '%';
        }else {
            this.refs.percent.innerHTML =  '0%';
        }
        this.refs.audio.currentTime = (moveX/410) * this.refs.audio.duration
    }
    render() {
        this.a = [];
        this.num = 0;

        if(sessionStorage.isTouch == "true") {
            //触屏
            console.log('touch');
            this.a.push(
                <div className="help_bg_touch" ref="helpBg" key={this.num++}>
                    <div className="help_audio top_touch">
                        <audio src={`${ASSETS}`+ (PRODUCTION ? '':'assets/') + `music/help.ogg`} controls id="audio" ref="audio"></audio>
                        <div className="play" ref="play" onClick={this.play}></div>
                        <div className="audio_bar">
                            <div className="bar" ref="bar"></div>
                            <div className="audio_button" ref="audio_button" >
                                <span className="percent" ref="percent">0%</span>
                            </div>
                        </div>
                    </div>
                    <div className="help_top">
                        操作帮助
                    </div>
                    <div className="ul_bg">
                        <ul ref="ul">
                            <li ref="li">
                                <div className="help_title">·沙具柜·</div>
                                <div className="img1"></div>
                                <div className="help_check">查看模具</div>
                                <div className="help_font">左右滑动滑块，查看分类中所有模具</div>
                            </li>
                            <li>
                                <div className="help_title">·沙具柜·</div>
                                <div className="img2"></div>
                                <div className="help_check">沙具的选择</div>
                                <div className="help_font">点击选择沙具移动至沙盘</div>
                            </li>
                            <li>
                                <div className="help_title">·沙具柜·</div>
                                <div className="img3"></div>
                                <div className="help_check">取消选择</div>
                                <div className="help_font">点击模具以外的地方取消选择</div>
                            </li>
                            <li>
                                <div className="help_title">·模具·</div>
                                <div className="img4"></div>
                                <div className="help_check">选择模具</div>
                                <div className="help_font">长按沙盘中沙具，至可操作状态，再次长按可切换状态</div>
                            </li>
                            <li>
                                <div className="help_title">·模具·</div>
                                <div className="img5"></div>
                                <div className="help_check">模具的移动</div>
                                <div className="help_font">一个手指移动模具至沙盘中任何地方</div>
                            </li>
                            <li>
                                <div className="help_title">·模具·</div>
                                <div className="img6"></div>
                                <div className="help_check">模具的旋转</div>
                                <div className="help_font">旋转状态下，左右滑动</div>
                            </li>
                            <li>
                                <div className="help_title">·模具·</div>
                                <div className="img7"></div>
                                <div className="help_check">模具的高度调整</div>
                                <div className="help_font">旋转状态下，上下滑动</div>
                            </li>
                            <li>
                                <div className="help_title">·模具·</div>
                                <div className="img8"></div>
                                <div className="help_check">模具的放大缩小</div>
                                <div className="help_font">两个手指拉近或拉远</div>
                            </li>
                            <li>
                                <div className="help_title">·模具·</div>
                                <div className="img9"></div>
                                <div className="help_check">取消选中模具</div>
                                <div className="help_font">五个手指点击模具其余地方</div>
                            </li>
                            <li>
                                <div className="help_title">·模具·</div>
                                <div className="img10"></div>
                                <div className="help_check">删除模具</div>
                                <div className="help_font">点击模具操作状态中的删除按钮</div>
                            </li>
                            <li>
                                <div className="help_title">·绘制水·</div>
                                <div className="img11"></div>
                                <div className="help_check">启动绘制水模式</div>
                                <div className="help_font">点击绘制水按钮</div>
                            </li>
                            <li>
                                <div className="help_title">·擦除水·</div>
                                <div className="img12"></div>
                                <div className="help_check">擦除水</div>
                                <div className="help_font">点击擦除水按钮</div>
                            </li>
                            <li>
                                <div className="help_title">·沙盘视角·</div>
                                <div className="img13"></div>
                                <div className="help_check">旋转沙盘</div>
                                <div className="help_font">以一个手指作为中心点，另一个手指做旋转操作</div>
                            </li>
                        </ul>
                        <span className="left" onClick={this.left.bind(this)} ref="left"></span>
                        <span className="right" onClick={this.right.bind(this)} ref="right"></span>
                        <dl ref="dl">
                            <dt className="cur_help"></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                            <dt></dt>
                        </dl>
                    </div>
                    <Close/>
                </div>
            )
        }else {
            //PC
            console.log('PC');
            this.a.push(
                <div className="help_bg" ref="helpBg" key={this.num++}>
                    <div className="help_audio top_pc">
                        <audio src={`${ASSETS}`+ (PRODUCTION ? '':'assets/') + `music/help.ogg`} controls id="audio" ref="audio"></audio>
                        <div className="play" ref="play" onClick={this.play}></div>
                        <div className="audio_bar">
                            <div className="bar" ref="bar"></div>
                            <div className="audio_button" ref="audio_button" >
                                <span className="percent" ref="percent">0%</span>
                            </div>
                        </div>
                    </div>
                    <Close/>
                </div>
            )
        }

        return (
            <div className="main_cover" ref="mainCover">
                {this.a}
            </div>
        )
    }
}

export default helpPopup