import React from 'react'
import Close from '../Close'

class SandToyTool extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.gs = props.getGS()
        this.isSelected = false
    }
    componentDidMount(){
        setTimeout(()=> {
            this.mesh = this.gs.getSelected()[0]
        },10)
    }
    mouseDownHandle(o,e){
        e.preventDefault()
        switch (o){
            case 'right':
                this.isSelected = true
                this.flag = setInterval(()=>{
                    this.mesh.rotation.y = (this.mesh.rotation.y - Math.PI/60)%(Math.PI*2)
                },30)
                break
            case 'left':
                this.isSelected = true
                this.flag = setInterval(()=>{
                    this.mesh.rotation.y = (this.mesh.rotation.y + Math.PI/60)%(Math.PI*2)
                },30)
                break
            case 'remove':
                this.mesh.dispose()
                this.gs.removeTarget()
                this.props.hstt()
                break
        }
    }
    mouseLeaveHandler(){
        if(this.isSelected){
            clearInterval(this.flag)
        }
        this.isSelected = false
    }
    mouseUpHandler(){
        if(this.isSelected){
            clearInterval(this.flag)
        }
        this.isSelected = false
    }

    render(){
        return (
            <div className="sand-toy-tools">
                <Close close={this.props.hstt}/>
                <div className="sand-toy-tool"
                     onMouseDown={(e)=>this.mouseDownHandle('left',e)}
                     onMouseLeave={()=>this.mouseLeaveHandler()}
                     onMouseUp={()=>this.mouseUpHandler()}
                >left rotation</div>
                <div className="sand-toy-tool"
                     onMouseDown={(e)=>this.mouseDownHandle('right',e)}
                     onMouseLeave={()=>this.mouseLeaveHandler()}
                     onMouseUp={()=>this.mouseUpHandler()}
                >right rotation</div>
                <div className="sand-toy-tool"
                     onMouseUp={(e)=>this.mouseDownHandle('remove',e)}
                >remove</div>
            </div>
        )
    }
}
export default SandToyTool
