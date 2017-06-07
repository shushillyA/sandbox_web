import {Loader} from './loader'
let delegate = require('delegate')

class PickUp {
    constructor(scene, deskSurface, objs) {
        Object.assign(this, {scene, deskSurface, objs})

        this.loader = new Loader(scene, objs)
        this.choseItem = null

        this.delegation = delegate(document.body, '.item', 'pointerdown', this.pick.bind(this), false)
        document.addEventListener('pointermove', this.move.bind(this), false)
        document.addEventListener('pointerup', this.drop.bind(this), false)

        this.spriteManagerLoad = new BABYLON.SpriteManager("playerManagr",ASSETS + `img/sandToyLoad.png`, 1000, 80, scene); //加载动画的精灵图

        this.modelCount = {}   //同一个沙具被拉了几个

        this.objIndex = 0      //累加模具，用于命名m1,m2,m3
    }

    pick(event) {
        event.preventDefault()
        if(this.choseItem) return //如果有正在拉的沙具就不能再次拉
        if(this.scene.touch && this.scene.touch.currentOperation !== 0) return //在操作沙具的时候不能再拉新的沙具
        this.scene.drawer.disposed() //如果在划水就取消画水

        //取消正在操作的沙具
        if(this.scene.touch){
            this.scene.touch.cancelChoose()
        }else{
            this.scene.keys.removeTarget()
        }

        this.choseItem = document.createElement('div')
        this.choseItem.index = event.target.getAttribute('data-number')
        this.choseItem.length = event.target.getAttribute('data-length')
        this.choseItem.className = event.target.className
        this.choseItem.style.backgroundImage = event.target.style.backgroundImage
        this.choseItem.imgSource = (this.choseItem.style.backgroundImage).split('"')[1]
        this.choseItem.style.backgroundPosition = event.target.style.backgroundPosition
        this.choseItem.style.backgroundSize = event.target.style.backgroundSize
        this.choseItem.style.position = 'absolute'
        this.choseItem.style.top = event.pageY - 20+ 'px'
        this.choseItem.style.left = event.pageX - 20 + 'px'
        this.choseItem.style.zIndex = '100'
        this.choseItem.type = event.target.getAttribute('type')
        this.choseItem.id = event.target.getAttribute('name')
        document.body.appendChild(this.choseItem)
        if (!this.modelCount['m' + this.choseItem.id]) {
            this.modelCount['m' + this.choseItem.id] = {}
            this.modelCount['m' + this.choseItem.id].mno = 1
        } else {
            this.modelCount['m' + this.choseItem.id].mno++
        }
        this.objs['m' + (++this.objIndex)] = {//用于记录下拉过程，但是没有属性m(保存沙具)，当放在桌上时添加m属性
            mid: this.choseItem.id,
            mno: this.modelCount['m' + this.choseItem.id].mno,
            o: 1,
            t: 'model'
        }
    }


    move(event) {
        event.preventDefault()
        if (this.choseItem === null) return
        this.choseItem.style.left = event.pageX - 25 + "px"
        this.choseItem.style.top = event.pageY - 50 + "px"
    }

    drop(event) {
        event.preventDefault()

        if (this.choseItem !== null) {
            setTimeout(() => {
                this.choseItem.remove(0,0,1/15,1)
                this.choseItem = null
            }, 30)
            var pickResult = this.scene.pick(event.clientX, event.clientY, (m) => m === this.deskSurface)
            if (pickResult.hit) { //有碰到桌面
                //选中标记
                let loading = new BABYLON.Mesh.CreatePlane("loadingm" + this.objIndex, 15, this.scene) //loading的缩略图

                loading.material = new BABYLON.StandardMaterial("loadingm" + this.objIndex + 'Mat', this.scene)
                loading.material.diffuseTexture = new BABYLON.Texture(this.choseItem.imgSource, this.scene)
                loading.material.diffuseTexture.uOffset = this.choseItem.index/this.choseItem.length
                loading.material.diffuseTexture.vOffset = 0
                loading.material.diffuseTexture.uScale =  1/this.choseItem.length
                loading.material.diffuseTexture.vScale = 1
                loading.material.diffuseTexture.hasAlpha = true //是否支持透明
                loading.material.emissiveColor = new BABYLON.Color3(1, 1, 1) //自发光
                loading.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y //面向相机ss
                loading.position = Object.assign({},pickResult.pickedPoint)
                loading.position.y = -7.5
                let loadIcon = new BABYLON.Sprite('loadIcon',this.spriteManagerLoad)//loading的加在动画
                loadIcon.position = Object.assign({},pickResult.pickedPoint)
                loadIcon.position.y = 5
                loadIcon.size = 7
                loadIcon.playAnimation(0,7,true,100)

                this.loader.loadListAdd(pickResult.pickedPoint, this.choseItem.id, 'm' + this.objIndex,loadIcon)
                this.objs['m' + this.objIndex].m = {} //添加m熟悉，用于添加position，说明用户以放置好，沙具加载完成后替换现在的对象
                this.objs['m' + this.objIndex].m.position = pickResult.pickedPoint
                this.objs['m' + this.objIndex].m.scaling = {x:1,y:1,z:1}
                this.objs['m' + this.objIndex].m.rotation = {x:Math.PI,y:Math.PI,z:Math.PI}//沙具放下的时候是背对的，把它反回来
            } else {
                delete this.objs['m' + this.objIndex]
            }
        }
    }

    onDispose() {
        document.body.removeEventListener('pointermove', this.move.bind(this), false)
        document.body.removeEventListener('pointerup', this.drop.bind(this), false)
    }
}

export {PickUp}