import React from 'react'
import { connect } from 'react-redux'
import FinishPopup from '../components/inventory/FinishPopup'
import HelpPopup from '../components/inventory/HelpPopup'
import {gameLock,gameMuic,gameFinish} from '../actions/index'

class GameTools extends React.Component{
    constructor({props}){
        super(props);
        this.props = props;
        this.helpClick = this.helpClick.bind(this)
    }
    componentDidMount() {
            let h = document.documentElement.clientHeight;
            let setClick_li = this.refs.setBtn.childNodes;
            let min = (h-950)/12;
            if(-min > 25) {
                min = -25;
            }
            this.refs.setBtn.style.top = min + 25 +'px';
            for(let btn of setClick_li){
                btn.style.height = min + 110 +'px';
                btn.firstChild.style.backgroundSize = (min + 80 +'px');
                btn.firstChild.style.width = min + 80 +'px';
                btn.firstChild.style.height = min + 90 +'px';
                btn.firstChild.style.marginLeft = -min/2 +'px';
            }
    }
    helpClick(){
        this.refs.helpPopup.helpBlock();
        window.stopOperation = true
    }
    finishClick() {
        this.refs.help.style.display = 'none';
        this.refs.finish.style.display = 'none';
        this.refs.music.style.display = 'none';
        this.refs.watch.style.display = 'block';
        this.refs.beforehand.play();
        this.props.dispatch(gameFinish())
    }
    watchClick() {
        this.refs.finishPopup.finishBlock()
        window.stopOperation = true
    }

    musicClick() {
        let bgi =  this.refs.refMusic.style.backgroundImage;
        bgi == `url("${ASSETS}img/musicClose.png")` || !bgi ? this.refs.refMusic.style.backgroundImage = `url("${ASSETS}img/music.png")` : this.refs.refMusic.style.backgroundImage = `url("${ASSETS}img/musicClose.png")`;
        let music = this.refs.video;
        console.log(music);
        if(music.paused){
            console.log(1);
            music.play();
        }else{
            console.log(2);
            music.pause();
        }
        this.props.dispatch(gameMuic())
    }

    render(){
        let swich = this.props.game.music ? '打开' : '关闭';
        let src = `${ASSETS}music/music.ogg`;
        const playStyle = {display:this.props.game.finish ? 'none' : 'block'}
        const previewStyle = {display:this.props.game.finish ? 'block' : 'none'}

        return (
            <div>
                <ul className="right_set" ref="setBtn">
                    <li style={playStyle} className="help" ref="help">
                        <div className="help_bg_btn"
                             onClick={this.helpClick}
                        ></div>
                        <p>操作帮助</p>
                    </li>
                    <li style={playStyle} className="finish" ref="finish">
                        <div className="finish_bg_btn"
                             onClick={this.finishClick.bind(this)}
                        ></div>
                        <p>完成制作</p>
                        <audio src={`${ASSETS}music/over.ogg`} ref="beforehand"></audio>
                    </li>
                    <li style={playStyle} className="music" ref="music">
                        <div className="music_bg_btn"
                             onClick={this.musicClick.bind(this)}
                             ref="refMusic"
                        >
                            <audio className="music_auto" ref="video" autoPlay loop src={src}>
                            </audio>
                        </div>
                        <p className="music_text">
                            {swich}音乐
                        </p>
                    </li>
                    <li style={previewStyle} className="watch" ref="watch">
                        <div className="watch_btn"
                             onClick={this.watchClick.bind(this)}></div>
                        <p>
                            完成预览
                        </p>
                    </li>
                </ul>
                <FinishPopup ref="finishPopup"/>
                <HelpPopup ref="helpPopup"/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    game:state.gameTools
});

GameTools = connect(mapStateToProps)(GameTools);

export default GameTools