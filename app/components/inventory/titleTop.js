import React from 'react'
import {titleTop} from '../../actions/index'
import { connect } from 'react-redux'

class TitleTop extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    switchover(event) {
        // let box_child = this.refs.box.childNodes;
        let lis = event.target.parentNode.parentNode.childNodes;

        //重置顶部tab栏样式
        for (let i = 0; i < lis.length ; i ++) {
            //判断当前点击选中的是哪一个
            if( lis[i] === event.target.parentNode) {
                //发送 action
                this.props.dispatch(titleTop(0,1,0,i));
                lis[i].style.backgroundImage = `url('${ASSETS}img/selected_bg.png')`;
                lis[i].childNodes[2].style.backgroundImage = `url('${ASSETS}img/selected_right.png')`;
                lis[i].style.color = '#A95F0E';
            }
            if( lis[i] !== event.target.parentNode) {
                lis[i].style.backgroundImage = `url('${ASSETS}img/select_bg.png')`;
                lis[i].childNodes[2].style.backgroundImage = `url('${ASSETS}img/select_right.png')`;
                lis[i].style.color = '#C09C4C';
            }
        }
    }

    render(){
        return(
            <ul className="ul">
                <li className="li z6" id="li_current" ref="animal" onClick={(event) => {this.switchover(event)}}><span></span><span className="middle">动物</span><span className="right"></span></li>
                <li className="li z5" ref="building" onClick={(event) => {this.switchover(event)}}><span></span><span className=" vehicle middle">建筑</span><span className="right"></span></li>
                <li className="li z4" ref="animal" onClick={(event) => {this.switchover(event)}}><span></span><span className="middle">交通工具</span><span className="right"></span></li>
                <li className="li z3" ref="human" onClick={(event) => {this.switchover(event)}}><span></span><span className="middle">人物</span><span className="right"></span></li>
                <li className="li z2" ref="article" onClick={(event) => {this.switchover(event)}}><span></span><span className="middle">物品</span><span className="right"></span></li>
                <li className="li z1" ref="plant" onClick={(event) => {this.switchover(event)}}><span></span><span className="middle">植物</span><span className="right"></span></li>
            </ul>
        )
    }
}

TitleTop = connect()(TitleTop);
export default TitleTop