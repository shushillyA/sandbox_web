class Keys {
    /**
     *
     * @param camera 相机
     * @param ss     选中标记
     * @param rp     移动的参考面
     * @param objs   沙具，水存储对象
     */
    constructor(camera, ss, rp, objs) {
        Object.assign(this, {camera, ss, rp, objs})
        this.event = this.mountTargetKey.bind(this)           //加载选中沙具的事件监听
        this.unEvent = this.unmountTargetKey.bind(this)       //没有选中沙具事件监听
        document.onkeydown = (e) => {                          //默认没有选中沙具的监听事件
            this.unEvent(e)
        }
    }

    setTarget(t) {                                            //设置选中目标，选中方法在move.js里面（不要问我为什么）
        this.target = t
        this.camera.keysUp = []                               //去掉引擎自带的事件
        this.camera.keysDown = []
        this.camera.keysLeft = []
        this.camera.keysRight = []
        document.onkeydown = (e) => {                        //换成选中监听事件
            this.event(e)
        }
        document.onkeyup = () => {                               //选中沙具时的keyDown时间

            if (window.stopOperation) return                    //用了全局，不提倡啊！但是为了快速完成需求没办法，因为是在react里面改变这里的操作。互动比较麻烦
            if (this.rp.visibility) this.rp.visibility = false   //去掉参考面
            this.objs[this.target.msId].o = 0                   //做操状态改为0，无操作

        }
        this.yAxis = this.target.getBoundingInfo().boundingBox.extendSize     //获取沙具的高度
        this.ss.position = this.target.position.clone()                        //把选中标识放在沙具头上
        this.ss.position.y += (this.yAxis.y * this.target.scaling.y * 2 + 5)
        this.ss.visibility = 1
    }


    removeTarget() {                                    //移除沙具选中
        if (!this.target) return
        this.target = null
        document.onkeydown = (e) => {
            this.unEvent(e)
        }
        document.onkeyup = null
        this.camera.keysUp.push(38)                      //加回引擎自带的相机操作
        this.camera.keysDown.push(40)
        this.camera.keysLeft.push(37)
        this.camera.keysRight.push(39)
        this.ss.visibility = 0                           //隐藏选中标识
    }

    onDispose() {
        document.onkeydown = null
        document.onkeyup = null
    }

    unmountTargetKey(e) {
        if (window.stopOperation) return               //取消所有操作，应该是在预览页面不然进行操作吧

        switch (e.keyCode) {                           //zoom相机视角，在没有选中的时候，选中的时候pageUp，和Down是放大缩小沙具
            case 33:
                if (this.camera.radius > 10) this.camera.radius -= 2
                break
            case 34:
                if (this.camera.radius < 150) this.camera.radius += 2
                break
        }
    }

    mountTargetKey(e) {

        if (window.stopOperation) return //在弹出层时不能动

        let downDir, right
        if (e.keyCode == 87 || e.keyCode == 83 || e.keyCode == 68 || e.keyCode == 65) {  //在移动的时候
            downDir = new BABYLON.Vector3(this.camera.position.x, 0, this.camera.position.z).normalize() //指向相机方向，y为0的空间向量的膜向量
            right = new BABYLON.Vector3.Cross(downDir, BABYLON.Axis.Y) //于世界地图的Y轴想cross，求的右方向的空间膜向量
            if (!this.rp.visibility) this.rp.visibility = true
            this.rp.position.y = this.target.position.y + 2
        } else {
            if (this.objs[this.target.msId].o == 2 && e.keyCode != 38 && e.keyCode != 40) return //在移动的时候不允许做移动以外的操作
        }
        let oldPosition = {
            x: this.target.position.x,
            z: this.target.position.z
        }
        switch (e.keyCode) {
            case 87: //w
                this.target.position.addInPlace(downDir.negate()) //相加两个空间向量，像被加向量的方向移动被加向量的长度（1）
                break
            case 83: //s
                this.target.position.addInPlace(downDir)
                break
            case 68: //d
                this.target.position.addInPlace(right)
                break
            case 65: //a
                this.target.position.addInPlace(right.negate())
                break
            case 33: //pageup
                this.objs[this.target.msId].o = 3
                if (this.target.scaling.x < 1.5) {
                    this.target.scaling.x += 0.1
                    this.target.scaling.y += 0.1
                    this.target.scaling.z += 0.1
                }
                break
            case 34: //pagedown
                this.objs[this.target.msId].o = 3
                if (this.target.scaling.x > 0.5) {
                    this.target.scaling.x -= 0.1
                    this.target.scaling.y -= 0.1
                    this.target.scaling.z -= 0.1
                }
                break
            case 38: //up
                this.objs[this.target.msId].o = 2
                if (this.target.position.y < 30)
                    this.target.position.y += 1
                break
            case 40: //down
                this.objs[this.target.msId].o = 2
                if (this.target.position.y > -12)
                    this.target.position.y -= 1
                break
            case 37: //left
                this.objs[this.target.msId].o = 4
                this.target.rotation.y = (this.target.rotation.y + Math.PI / 60) % (Math.PI * 2)
                break
            case 39: //right
                this.objs[this.target.msId].o = 4
                this.target.rotation.y = (this.target.rotation.y - Math.PI / 60) % (Math.PI * 2)
                break
            case 46: //delete
                this.objs[this.target.msId].o = 5
                delete this.objs[this.target.msId].m

                this.target.dispose()
                this.removeTarget()
                break
        }

        if (this.target && (this.target.position.x < -40 || this.target.position.x > 40 || this.target.position.z < -40 || this.target.position.z > 40)) { //在桌子内动
            this.target.position.x = oldPosition.x
            this.target.position.z = oldPosition.z
        }

        if (e.keyCode == 46) return

        this.ss.position = this.target.position.clone()     //跟着沙具走
        this.ss.position.y += (this.yAxis.y * this.target.scaling.y * 2 + 5)
    }
}

export default Keys