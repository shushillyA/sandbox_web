import React, {Component} from 'react';
import Close from '../Close';
import { connect } from 'react-redux';
import { fetchExit } from '../../actions/exitAction';

class Exit extends Component {
    constructor(props) {
        super(props)
        Object.assign(this,{props})
        this.close = this.close.bind(this);
        this.leave = this.leave.bind(this);
    }
    exitBlock() {
        this.refs.mainCover.style.display = 'block';
        this.refs.exitBg.style.display = 'block';
        window.stopOperation = true
    }
    close() {
        this.refs.mainCover.style.display = 'none';
        this.refs.exitBg.style.display = 'none';
        window.stopOperation = false
    }
    leave(event) {
        event.preventDefault();
        this.props.dispatch(fetchExit(sessionStorage.getItem("access_token")));
    }
    render() {
        return (
            <div >
                <div
                    className="exit"
                    onClick={this.exitBlock.bind(this)}
                ></div>
                <div className="main_cover" ref="mainCover">
                    <div className="exit_bg set_bg" ref="exitBg">
                        <div className="exit_content">
                            <p>沙盘尚未完成，确认要离开吗？</p>
                            <span className="false" onClick={this.close}></span>
                            <span className="true" onClick={this.leave}></span>
                        </div>
                        <Close/>
                    </div>
                </div>
            </div>
        )
    }
}
Exit = connect()(Exit);
export default Exit