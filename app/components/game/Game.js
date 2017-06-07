import React from 'react'
import Inventory from '../inventory/Inventory'
import GameScene from '../../screen/gameScene'
import Exit from '../inventory/Exit'
import GameTools from '../../containers/GameTools'
import {fetchGetToy} from '../../actions/getToyAction'
import {draw, erase} from '../../actions/index'

class Game extends React.Component {
    constructor(props) {
        super(props);
        Object.assign(this, {props});
        window.startTime = Math.round(Date.parse(new Date)/1000);
        window.imagecount = 1;
        window.stopOperation = false
    }

    componentWillMount() {
        window.reportData = {};
        this.props.dispatch(fetchGetToy(sessionStorage.access_token))
    }

    componentDidMount() {
        this.gs = new GameScene(this.props.dispatch)
        setTimeout(() => {
            this.drawer = this.gs.getDrawer()
        }, 500)
    }
    componentDidUpdate() {
        if (this.props.game.finish) {
            console.log("finish")
            this.gs.stopRecord()
        }
    }

    drawerHandle(e) {
        if (!this.drawer) {
            this.drawer = this.gs.getDrawer()
            if (this.drawer) {
                alert('等待游戏加载完全')
                return
            }
        }
        e.preventDefault()
        if (this.props.drawer.draw) {
            this.drawer.stopDraw()
            this.props.dispatch(draw(false))
        } else {
            this.drawer.startDraw()
            this.props.dispatch(draw(true))
        }
        this.props.dispatch(erase(false))
    }

    eraseHandle(e) {
        e.preventDefault()
        if (!this.drawer) return
        if (this.props.drawer.erase) {
            this.drawer.stopErase()
            this.props.dispatch(erase(false))
        } else {
            this.drawer.startErase()
            this.props.dispatch(erase(true))
        }
        this.props.dispatch(draw(false))
    }

    render() {
        let drawstyle;
        let erasestyle;
        //画水、擦除水点击后效果
        if(document.documentElement.clientWidth < 1450){
            drawstyle = this.props.drawer.draw ? {
                backgroundImage: `url('${ASSETS}img/brusher.png')`,
                backgroundSize: "110px 110px",
                width: "110px",
                height: "110px",
                left: "520px",
                top: "5px"
            } : {backgroundImage: `url('${ASSETS}img/brusher.png')`};
            erasestyle = this.props.drawer.erase ? {
                backgroundImage: `url('${ASSETS}img/eraser.png')`,
                backgroundSize: "110px 110px",
                width: "110px",
                height: "110px",
                left: "650px",
                top: "5px"
            } : {backgroundImage: `url('${ASSETS}img/eraser.png')`}
        }else if(document.documentElement.clientWidth < 1900) {
            drawstyle = this.props.drawer.draw ? {
                backgroundImage: `url('${ASSETS}img/brusher.png')`,
                backgroundSize: "110px 110px",
                width: "110px",
                height: "110px",
                left: "650px",
                top: "5px"
            } : {backgroundImage: `url('${ASSETS}img/brusher.png')`};
            erasestyle = this.props.drawer.erase ? {
                backgroundImage: `url('${ASSETS}img/eraser.png')`,
                backgroundSize: "110px 110px",
                width: "110px",
                height: "110px",
                left: "780px",
                top: "5px"
            } : {backgroundImage: `url('${ASSETS}img/eraser.png')`}
        }else {
            drawstyle = this.props.drawer.draw ? {
                backgroundImage: `url('${ASSETS}img/brusher.png')`,
                backgroundSize: "110px 110px",
                width: "110px",
                height: "110px",
                left: "840px",
                top: "5px"
            } : {backgroundImage: `url('${ASSETS}img/brusher.png')`};
            erasestyle = this.props.drawer.erase ? {
                backgroundImage: `url('${ASSETS}img/eraser.png')`,
                backgroundSize: "110px 110px",
                width: "110px",
                height: "110px",
                left: "980px",
                top: "5px"
            } : {backgroundImage: `url('${ASSETS}img/eraser.png')`}
        }
        //
        // let img = document.createElement('img');
        // img.src = `${ASSETS}dist/img/net_err.png`;
        // let img1 = document.createElement('img');
        // img1.src = `${ASSETS}dist/img/tijiao.png`;
        // let img2 = document.createElement('img');
        // img2.src = `${ASSETS}dist/img/err_wait_btn.png`;
        // let img3 = document.createElement('img');
        // img3.src = `${ASSETS}dist/img/finish_btn.png`;
        // let img4 = document.createElement('img');
        // img4.src = `${ASSETS}dist/img/exit_bg.png`;
        setInterval(() => {
            if (navigator.onLine) {
                this.refs.net.style.backgroundImage = `url('${ASSETS}img/net.png')`;
                this.refs.net_text.innerHTML = "网络正常"

            } else {
                this.refs.net.style.backgroundImage = `url('${ASSETS}img/net_err.png')`;
                this.refs.net_text.innerHTML = "网络异常"
            }
        },3000);
        return (
            <div className="game">
                {!this.props.game.finish ? <Inventory ref="inventory"/> : ''}
                {!this.props.game.finish ? <div className="drawer water_posation" onClick={(e) => this.drawerHandle(e)} style={drawstyle}> </div> : ''}
                {!this.props.game.finish ? <div className="eraser water_posation" onClick={(e) => this.eraseHandle(e)} style={erasestyle}> </div> : ''}
                <canvas id="renderCanvas" ref="canvas"/>
                <GameTools/>
                <Exit/>
                {this.props.loading.isLoad ? <div className="loading" ref="cover"> </div> : ''}
                <div className="net_box">
                    <span className="net" ref="net"></span>
                    <span className="net_text" ref="net_text">网络正常</span>
                </div>
            </div>
        )
    }
}

export default Game