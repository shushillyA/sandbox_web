import {draw, erase} from '../actions/index'

class Drawer{
    constructor(camera,scene,canvas,ground,objs,dispatch){
        Object.assign(this,{camera,scene,canvas,ground,objs,dispatch})
        this.draw = false                              //是否在画水状态
        this.erase = false                             //是否在擦除状态
        this.isOnTheDesk = false                       //是否点击在桌子上
        this.decalMaterial = new BABYLON.StandardMaterial("decalMat", scene); //画水材料
        this.decalMaterial.emissiveColor = new BABYLON.Color3(0.2,0.6,0.8)
        this.decalMaterial.specularColor = new BABYLON.Color3(0,0,0)
        this.decalMaterial.diffuseColor = new BABYLON.Color3(0,0,0)
        this.down = this.onPointerDown.bind(this)         //鼠标按下事件
        this.move = this.onPointerMove.bind(this)         //鼠标移动事件
        this.up = this.onPointerUp.bind(this)             //鼠标放开事件
        this.isMount = false                               //是否加载
        this.id = 1                                         //画水的id
        this.mesh = BABYLON.Mesh.CreateDisc("water",4,20,scene) //看回放画水
        this.mesh.material = this.decalMaterial
        this.mesh.rotation.x = Math.PI/2
        this.mesh.position = new BABYLON.Vector3(-5000,0,0)
    }
    startDraw(){                                          //开始画方法
        if(this.scene.touch){                            //开始的时候取消沙具选中
            this.scene.touch.cancelChoose()
        }else{
            this.scene.keys.removeTarget()
        }
        this.draw = true
        this.erase = false
        if(!this.isMount) this.mountEvent()             //加载监听事件
        this.scene.isDraw = true
    }
    stopDraw() {
        this.draw = false
        this.unmountEvent()                              //挂载监听事件
        this.scene.isDraw = false
    }
    startErase(){
        if(this.scene.touch){                           //开始的时候取消沙具选中
            this.scene.touch.cancelChoose()
        }else{
            this.scene.keys.removeTarget()
        }
        this.erase = true
        this.draw = false
        if(!this.isMount) this.mountEvent()
        this.scene.isDraw = true
    }
    stopErase(){                                       //暂停擦除
        this.erase = false
        this.unmountEvent()
        this.scene.isDraw = false
    }
    disposed(){                                         //取消所有画水操作
        if (this.draw) {
            this.stopDraw()
            this.dispatch(draw(false))
        } else if (this.erase) {
            this.stopErase()
            this.dispatch(erase(false))
        }
    }
    mountEvent(){
        this.isMount = true
        this.camera.detachControl(this.canvas)
        this.canvas.addEventListener("pointerdown",this.down, false)
        this.canvas.addEventListener("pointermove", this.move, false)
        this.canvas.addEventListener("pointerup", this.up, false)
    }
    unmountEvent(){
        this.isMount = false
        this.camera.attachControl(this.canvas, false)
        this.canvas.removeEventListener("pointerdown", this.down,false)
        this.canvas.removeEventListener("pointermove", this.move,false)
        this.canvas.removeEventListener("pointerup", this.up,false)
    }
    onPointerDown(event){
        if(event.button !== 0){
            return
        }

        var pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY,(mesh)=>{ return mesh === this.ground}) //是否点击中桌面
        if (pickInfo.hit) {
            this.isOnTheDesk = true
        }
    }
    onPointerMove(event){
        if(!this.isOnTheDesk) return

        if(this.draw){        //如果是画水操作
            let pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY,(mesh)=>{ return mesh === this.ground })
            if (pickInfo.hit) {
                let newWater = this.mesh.createInstance("w"+(this.id++))

                if(pickInfo.pickedPoint.x < -42.5 || pickInfo.pickedPoint.x > 42.5 || pickInfo.pickedPoint.z < -42.5 || pickInfo.pickedPoint.z > 42.5) //在边缘处缩小圆的面积，避免画出桌子
                    newWater.scaling = new BABYLON.Vector3(0.6,0.6,0.6)

                newWater.position.x = pickInfo.pickedPoint.x
                newWater.position.y = pickInfo.pickedPoint.y+0.1
                newWater.position.z = pickInfo.pickedPoint.z
                BABYLON.Tags.AddTagsTo(newWater,"water")
                this.objs[newWater.name] = {o:6,m:newWater,type:'water'}                               //添加到objs里面，用于记录操作
            }
        }
        if(this.erase){             //如果是擦除操作
            this.eraseFunc()
        }
    }
    eraseFunc(){
        let pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY,(mesh)=>{
            if(BABYLON.Tags.HasTags(mesh)) {
                if(mesh.matchesTagsQuery("water"))                //点击到的是水的面
                    return true
            }
        })
        if (pickInfo.hit) {
            this.objs[pickInfo.pickedMesh.name] = {o:7}
            pickInfo.pickedMesh.dispose()
            console.log("erase");
            this.eraseFunc()      //一直该处到没有水的面为止
        }else{
            return
        }
    }
    onPointerUp(){
        if(this.isOnTheDesk) {
            this.isOnTheDesk = false
        }
    }
}

export default Drawer