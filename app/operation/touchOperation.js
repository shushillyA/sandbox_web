import Hammer from 'hammerjs'

class TouchOperation {
    constructor(scene, ss, referencePlan, canvas, objs, camera) {
        Object.assign(this, {scene, ss, referencePlan, canvas, objs, camera})

        //操作按钮
        this.os = new BABYLON.Mesh.CreatePlane("operationTypeSign", 5, scene)      //操作标识
        this.moveMat = new BABYLON.StandardMaterial('moveMat', scene)              //操作标识的移动的贴图
        this.transformMat = new BABYLON.StandardMaterial('transformMat', scene)    //操作标识的操作的贴图
        this.moveMat.diffuseTexture = new BABYLON.Texture(ASSETS + "assets/texture/move.png", scene)
        this.transformMat.diffuseTexture = new BABYLON.Texture(ASSETS + "assets/texture/rotate.png", scene)
        this.moveMat.diffuseTexture.hasAlpha = this.transformMat.diffuseTexture.hasAlpha = true
        this.moveMat.emissiveColor = this.transformMat.emissiveColor = new BABYLON.Color3(1, 1, 1)
        this.os.material = this.moveMat
        this.os.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y //一直面向相机在y轴转
        this.os.visibility = 0
        BABYLON.Tags.AddTagsTo(this.os, "operation")

        this.mc = new Hammer.Manager(canvas)             //hammerjs对象
        this.mc.add(new Hammer.Press())                  //添加长按方法，默认不可用
        this.mc.add(new Hammer.Tap({enable: false}))    //添加点击方法，默认不可用
        this.mc.add(new Hammer.Pan({enable: false}))     //添加拖动方法，默认不可用
        this.mc.add(new Hammer.Pinch({enable: false}))   //添加pinch方法，默认不可用
        this.currentMesh = null                          //当前选中模型
        this.operation = 'move'                           //做操的标识
        this.currentOperation = 0                         //当前操作
        this.limitedCoordinate = 45
        this.startingPoint = null                        //拖动沙具时判断是不是在桌子上

        canvas.addEventListener('touchstart', this.disposeSandToyAndpick.bind(this), false)
        this.mc.on('press', this.choose.bind(this))
        this.mc.on('tap', this.tap.bind(this))
        this.mc.on('panmove', this.move.bind(this))
        this.mc.on('panend', this.dorp.bind(this))
        this.mc.on('pinch', this.zoomInAndOut.bind(this))
        this.mc.on('pinchend', this.zoomEnd.bind(this))
    }

    /**
     * 取消所有的操作
     */
    dispose(){
        this.currentOperation = 0
        this.cancelChoose()
        this.mc.get('press').set({enable: false})
    }

    /**
     * 放大缩小沙具
     * @param ev
     */
    zoomInAndOut(ev) {
        if (this.operation === 'move') return
        if (ev.additionalEvent === 'pinchin') {
            this.objs[this.currentMesh.msId].o = 3
            if (this.currentMesh.scaling.x > 0.5) {
                this.currentMesh.scaling.x -= 0.1
                this.currentMesh.scaling.y -= 0.1
                this.currentMesh.scaling.z -= 0.1
            }
        } else if (ev.additionalEvent === 'pinchout') {
            this.objs[this.currentMesh.msId].o = 3
            if (this.currentMesh.scaling.x < 1.5) {
                this.currentMesh.scaling.x += 0.1
                this.currentMesh.scaling.y += 0.1
                this.currentMesh.scaling.z += 0.1
            }
        }
    }

    /**
     * zoom结束操作状态变回无操作
     */
    zoomEnd() {
        if (this.operation === 'move') return
        this.objs[this.currentMesh.msId].o = 0
    }

    /**
     * 取消选中
     */
    cancelChoose(){
        if(this.currentOperation !== 0) return //在操作的时候不能取消选中

        this.ss.visibility = 0                  //隐藏删除沙具按钮，不要问我为什么叫ss，是因为原来的pc版沿用下来的，懒的改名字了
        this.os.visibility = 0                  //隐藏操作标识
        this.currentMesh = null
        this.mc.get('tap').set({enable: false})   //禁用做操
        this.mc.get('pan').set({enable: false})
        this.mc.get('pinch').set({enable: false})

        if (this.operation === 'transform') {     //如果是变形的时候，加引擎自带的相机操作
            this.camera.attachControl(this.canvas)
        }
        this.operation = 'move'                  //改回默认的move操作
        this.os.material = this.moveMat
    }

    /**
     * 取消操作和拖动时的选中沙具，因为panstart不灵敏经常选不中，所以用原生
     * @param ev
     */
    disposeSandToyAndpick(ev) {
        if(this.currentOperation !== 0) return            //在操作的时候不能进行其他新的操作

        if (ev.touches.length === 5 && this.currentMesh) { //如果5个手指
            this.cancelChoose()
        }else if (ev.touches.length === 1 && this.currentMesh) { //一个手指，选中沙具

            if (this.operation === 'move') {
                let pickResult = this.scene.pick(ev.touches[0].clientX, ev.touches[0].clientY, (m) => {
                    return m === this.currentMesh
                })
                if (pickResult.hit) {
                    this.referencePlan.position.y = this.currentMesh.position.y < -12 ? -12 : this.currentMesh.position.y
                    this.scene.addMesh(this.referencePlan)
                    this.referencePlan.visibility = true
                    this.startingPoint = this.getGroundPosition(true)
                    this.objs[this.currentMesh.msId].o = 2
                    this.currentOperation = 2

                    let vectorsWorld = this.currentMesh.getBoundingInfo().boundingBox.vectorsWorld;  //防止拉近桌子里面，获取沙具矩形的世界坐标的8个坐标
                    let point1 = vectorsWorld[0]
                    let point2 = vectorsWorld[1]

                    let offsetx = Math.abs(point1.x - point2.x) / 2
                    let offsetz = Math.abs(point1.z - point2.z) / 2
                    let offset = offsetx > offsetz ? offsetx : offsetz
                    this.limitedCoordinate = 45 - offset

                    if (this.startingPoint) {
                        // we need to disconnect camera from canvas
                        setTimeout(() => {
                            this.camera.detachControl(this.canvas)
                        }, 0)
                    }
                }
            }
        }
    }

    /**
     * 点击事件，点击操作图标
     * @param ev
     */
    tap(ev) {
        if(this.currentOperation !== 0) return         //在操作的时候不能进行其他新的操作

        let pickResult = this.scene.pick(ev.center.x, ev.center.y, (m) => {
            return BABYLON.Tags.MatchesQuery(m, "operation")
        })
        if (pickResult.hit) {
            let mesh = pickResult.pickedMesh
            if (mesh.name === 'selectedSign') {                 //删除图标，不要问我为什么是selectedSign
                this.objs[this.currentMesh.msId].o = 5          //删除状态，有空你自己把数字做成常量吧，我要走了
                delete this.objs[this.currentMesh.msId].m      //删除objs里面的改沙具对象，记录很快的，会被记录下来的，放心删啊
                this.currentMesh.dispose()                      //删掉沙具
                this.cancelChoose()
            } else {
                if (this.operation === 'move') {               //点击的操作选项，如果现在是move，就变成transform，反之亦然
                    this.operation = 'transform'
                    this.camera.detachControl(this.canvas)    //删掉引擎的相机操作
                    this.os.material = this.transformMat
                } else {
                    this.operation = 'move'
                    this.camera.attachControl(this.canvas)
                    this.os.material = this.moveMat
                }
            }
        }
    }

    /**
     * 长按选中沙具
     * @param ev
     */
    choose(ev) {
        if(this.currentOperation !== 0) return //在操作的时候不能进行其他新的操作
        if(this.scene.isDraw) return
        let pickResult = this.scene.pick(ev.center.x, ev.center.y, (m) => {
            return BABYLON.Tags.MatchesQuery(m, "sandToy")
        })
        if (pickResult.hit) {
            this.currentMesh = pickResult.pickedMesh

            this.yAxis = this.currentMesh.getBoundingInfo().boundingBox.extendSize
            this.ss.position = this.currentMesh.position.clone()
            this.ss.position.y += (this.yAxis.y * this.currentMesh.scaling.y * 2 + 5)
            this.ss.visibility = 1

            this.os.position = this.ss.position.clone()
            this.os.position.y += 6
            this.os.visibility = 1

            this.mc.get('tap').set({enable: true})
            this.mc.get('pan').set({enable: true})
            this.mc.get('pinch').set({enable: true})
        }
    }

    /**
     * 移动和其他手势
     * @param ev
     */
    move(ev) {

        this.ss.visibility = 0
        this.os.visibility = 0
        if (this.operation === 'move') {
            if (!this.startingPoint) {
                return;
            }

            let current = this.getGroundPosition(false)

            if (!current) {
                return
            }

            this.currentMesh.position.x = current.x
            this.currentMesh.position.y = current.y
            this.currentMesh.position.z = current.z
        } else {
            switch (ev.additionalEvent) {
                case 'panleft':
                    if (this.currentOperation === 4 || this.currentOperation === 0) {
                        this.currentOperation = 4
                        this.objs[this.currentMesh.msId].o = 4
                        this.currentMesh.rotation.y = (this.currentMesh.rotation.y + Math.PI / 60) % (Math.PI * 2)
                    }
                    break
                case 'panright':
                    if (this.currentOperation === 4 || this.currentOperation === 0) {
                        this.currentOperation = 4
                        this.objs[this.currentMesh.msId].o = 4
                        this.currentMesh.rotation.y = (this.currentMesh.rotation.y - Math.PI / 60) % (Math.PI * 2)
                    }
                    break
                case 'panup':
                    if (this.currentOperation === 2 || this.currentOperation === 0) {
                        this.currentOperation = 2
                        this.objs[this.currentMesh.msId].o = 2
                        if (this.currentMesh.position.y < 30)
                            this.currentMesh.position.y += 1
                    }
                    break
                case 'pandown':
                    if (this.currentOperation === 2 || this.currentOperation === 0) {
                        this.currentOperation = 2
                        this.objs[this.currentMesh.msId].o = 2
                        if (this.currentMesh.position.y > -12)
                            this.currentMesh.position.y -= 1
                    }
                    break
            }
        }
    }

    /**
     * 松手的操作
     * @param ev
     */
    dorp(ev) {
        if(!this.currentMesh) return
        this.yAxis = this.currentMesh.getBoundingInfo().boundingBox.extendSize
        this.ss.position = this.currentMesh.position.clone()
        this.ss.position.y += (this.yAxis.y * this.currentMesh.scaling.y * 2 + 5)
        this.ss.visibility = 1

        this.os.position = this.ss.position.clone()
        this.os.position.y += 6
        this.os.visibility = 1
        if (this.operation === 'move') { //如果是移动，还要去掉参考面，和加上相机操作，清楚开始点
            if (this.referencePlan.visibility) {
                this.scene.removeMesh(this.referencePlan)
                this.camera.attachControl(this.canvas)
                this.startingPoint = null
                this.referencePlan.visibility = false
            }
        }
        this.currentOperation = 0
        this.objs[this.currentMesh.msId].o = 0
    }

    getGroundPosition(start) {

        // Use a predicate to get position on the ground
        let pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, (mesh) => {
            return mesh === this.referencePlan
        })
        if (pickInfo.hit) {
            if (start || (pickInfo.pickedPoint.x > -this.limitedCoordinate && pickInfo.pickedPoint.x < this.limitedCoordinate && pickInfo.pickedPoint.z > -this.limitedCoordinate && pickInfo.pickedPoint.z < this.limitedCoordinate)) {
                return pickInfo.pickedPoint
            }
        }
        return null
    }
}

export default TouchOperation