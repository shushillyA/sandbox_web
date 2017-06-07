import React from 'react'
import PlayScene from '../../screen/playScene'
import {leapAction} from '../../actions/playAction'

class Play extends React.Component {
    constructor(props) {
        super(props)
        Object.assign(this, {props})
    }

    componentDidMount() {
        this.ps = new PlayScene(this.props.dispatch)
    }
    componentDidUpdate() {
        this.refs.currentSpot.style.width =  100*(this.props.control.currentTime/this.props.control.totalTime)+ '%'
        this.refs.bufferBar.style.width =  this.props.control.bufferPercent+ '%'
    }
    leap(e){
        let percent = (e.clientX-e.target.offsetLeft)/e.target.clientWidth
        let currentTime = this.props.control.totalTime*percent
        //console.log(`${Math.floor(currentTime/60)}:${Math.ceil(currentTime%60) < 10 ? '0'+Math.ceil(currentTime%60) : Math.ceil(currentTime%60)}`);
        this.props.dispatch(leapAction(currentTime))
        this.ps.play.loading(Math.floor(currentTime/60),(Math.ceil(currentTime%60))*40)

    }
    render() {
        return (
            <div className="playScene">
                <div className="control">
                    <div className="process" onClick={(e)=>{this.leap(e)}}>
                        <div ref = "currentSpot" className="currentSpot"> </div>
                        <div ref = "bufferBar" className="bufferBar"> </div>
                    </div>
                    <div className="time">
                        {`${Math.floor(this.props.control.currentTime/60)}:${Math.ceil(this.props.control.currentTime%60)}`}
                        /
                        {`${Math.floor(this.props.control.totalTime/60)}:${this.props.control.totalTime%60}`}</div>
                </div>
                <canvas id="renderCanvas"/>
            </div>
        )
    }
}

export default Play
