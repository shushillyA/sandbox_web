import React from 'react'

class Close extends React.Component{
    constructor(props){
        super(props)
        Object.assign(this,{props});
        this.close = this.close.bind(this);
    }
    close() {
        this.refs.close.parentNode.style.display = 'none';
        console.log(this.refs.close.parentNode.childNodes[0].childNodes.length);
        console.log(this.refs.close.parentNode.className === 'help_bg' || this.refs.close.parentNode.className === 'help_bg_touch');
        if(this.refs.close.parentNode.className === 'help_bg' || this.refs.close.parentNode.className === 'help_bg_touch'){
            this.refs.close.parentNode.childNodes[0].childNodes[0].pause();
            this.refs.close.parentNode.childNodes[0].childNodes[2].childNodes[1].childNodes[0].innerHTML = '0%';
            this.refs.close.parentNode.childNodes[0].childNodes[1].className = 'play';
            this.refs.close.parentNode.childNodes[0].childNodes[0].currentTime = 0;
            this.refs.close.parentNode.childNodes[0].childNodes[2].childNodes[0].style.width = 0;
            this.refs.close.parentNode.childNodes[0].childNodes[2].childNodes[1].style.left = 0;
        }
        this.refs.close.parentNode.parentNode.style.display = 'none';
        document.querySelector('.wait_size').style.display = "none";
        window.stopOperation = false
    }
    render(){
        return(
            <div className="close" onClick={this.close} ref="close">
                <span></span>
            </div>
        )
    }
}
export default Close