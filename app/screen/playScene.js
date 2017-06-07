import ScreenAb from './screenAb'
import Play from '../record/play'

class PlayScene extends ScreenAb{
    constructor(dispatch){
        super(dispatch)
        this.camera.detachControl(this.canvas)
        this.scene.objs = {} //存储加在的沙具数据
        this.scene.dispatch = dispatch
        this.play = new Play(this.scene)
    }
}
export default PlayScene