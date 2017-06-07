class Move{
    //相机，画布，场景，按键对象，移动参考层，objs（操作记录对象）
    constructor(camera,canvas,scene,referencePlan,objs){

        Object.assign(this,{camera,canvas,scene,referencePlan,objs})
        this.pickEvent = this.pick.bind(this)
        this.moveEvent = this.move.bind(this)
        this.dropEvent = this.drop.bind(this)
        this.canvas.addEventListener('pointerdown',this.pickEvent , false)
        this.canvas.addEventListener('pointermove', this.moveEvent, false)
        this.canvas.addEventListener('pointerup', this.dropEvent.bind(this), false)

        this.currentMesh = null
        this.startingPoint = null
        this.limitedCoordinate = 45

    }
    pick(event){

        if (event.button !== 0 || this.scene.isDraw) {
            return
        }
        let pickResult = this.scene.pick(event.clientX, event.clientY,(m)=>{ //点的是否是沙具
            return BABYLON.Tags.MatchesQuery(m, "sandToy")
        })
        if(pickResult.hit){
            this.currentMesh = pickResult.pickedMesh //保存选中的沙具
            this.referencePlan.position.y = this.currentMesh.position.y < -12 ? -12 : this.currentMesh.position.y //移动参考层到沙具下面
            this.referencePlan.visibility = true //显示参考层
            this.startingPoint = this.getGroundPosition(true) //记录开始点
            this.objs[this.currentMesh.msId].o = 2 //标记沙具对象的操作记录为2（移动）

            this.scene.keys.setTarget(this.currentMesh)//标记被选中
            window.stopOperation = true //禁止按键事件

            let vectorsWorld = this.currentMesh.getBoundingInfo().boundingBox.vectorsWorld; //防止沙具超出桌子
            let point1 = vectorsWorld[0] //沙具矩形盒子的下面对角线点1
            let point2 = vectorsWorld[1] //沙具矩形盒子的下面对角线点2

            let offsetx = Math.abs(point1.x - point2.x)/2 //下面的长的一半
            let offsetz = Math.abs(point1.z - point2.z)/2 //下面的宽的一半
            let offset = offsetx > offsetz ? offsetx : offsetz //取较长的
            this.limitedCoordinate = 44 - offset //由桌面的一半减去offset算出可摆放的位置

            if (this.startingPoint) {
                // we need to disconnect camera from canvas
                setTimeout(()=>{
                    this.camera.detachControl(this.canvas)
                }, 0)

            }

        }else{

            this.scene.keys.removeTarget()

        }
    }
    move(event){
        if (!this.startingPoint) {
            return;
        }
        this.scene.keys.removeTarget()

        let current = this.getGroundPosition(false)

        if (!current) {
            return
        }

        this.currentMesh.position.x = current.x
        this.currentMesh.position.y = current.y
        this.currentMesh.position.z = current.z

    }

    drop(){

        if (this.referencePlan.visibility) {
            this.camera.attachControl(this.canvas) //重新添加相机操作事件
            this.startingPoint = null
            this.referencePlan.visibility = false //隐藏参考层
            this.objs[this.currentMesh.msId].o = 0
            window.stopOperation = false//启用按键事件
            return
        }

    }
    getGroundPosition(start) {

        // Use a predicate to get position on the ground
        let pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY,(mesh)=>{ return mesh == this.referencePlan })
        if (pickInfo.hit) {

            if( start || (pickInfo.pickedPoint.x > -this.limitedCoordinate && pickInfo.pickedPoint.x < this.limitedCoordinate && pickInfo.pickedPoint.z > -this.limitedCoordinate && pickInfo.pickedPoint.z < this.limitedCoordinate)){

                return pickInfo.pickedPoint

            }

        }
        return null
    }
    onDispose(){
        this.canvas.removeEventListener('pointerdown',this.pickEvent , false)
        this.canvas.removeEventListener('pointermove', this.moveEvent, false)
        this.canvas.removeEventListener('pointerup', this.dropEvent.bind(this), false)
    }
}
export default Move