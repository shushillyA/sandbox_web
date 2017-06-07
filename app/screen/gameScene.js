import {PickUp} from '../operation/pickUp'
import Move from '../operation/move'
import {Record} from '../record/record'
import TouchOperation from '../operation/touchOperation'
import Drawer from '../operation/drawer'
import Keys from '../operation/keys'
import FetchHelper from '../lib/fetchHelper'
import ScreenAb from './screenAb'

window.isLoad = false;
class GameScene extends ScreenAb {
    constructor(dispatch) {
        super(dispatch)
        let objs = {} //玩家所有添加的沙具的对象，用于操作记录

        Object.assign(this, {objs})

        //移动的参考层
        let referencePlanMat = new BABYLON.StandardMaterial('referencePlanMat', this.scene)
        referencePlanMat.alpha = 0.3
        referencePlanMat.specularColor = new BABYLON.Color3(0, 0, 0)
        referencePlanMat.diffuseColor = new BABYLON.Color3(0, 0, 0)
        referencePlanMat.emissiveColor = new BABYLON.Color3(1, 1, 0.6)
        let referencePlan = new BABYLON.Mesh.CreateGround('referencePlan', 90, 90, 1, this.scene)
        referencePlan.material = referencePlanMat
        referencePlan.visibility = false

        //是否是触屏来切换触摸或者键盘，鼠标操作
        if (sessionStorage.isTouch === 'true') {
            this.scene.touch = new TouchOperation(this.scene, this.selectedSign, referencePlan, this.canvas, objs, this.camera)
        } else {
            this.scene.keys = new Keys(this.camera, this.selectedSign, referencePlan, objs)
            this.scene.move = new Move(this.camera, this.canvas, this.scene, referencePlan, objs) //初始化拖动操作
        }
        this.scene.drawer = new Drawer(this.camera, this.scene, this.canvas, this.ground, objs, dispatch) //画水操作
        this.scene.pickup = new PickUp(this.scene, this.ground, objs)//初始化拖拉沙具操作

        //每十分钟截图，第一次截图在loader.js里面,最后一张在stopRecord里面，没时间重构，不要问我为什么不提取
        this.screenTimer = setInterval(() => {
            BABYLON.Tools.CreateScreenshotUsingRenderTarget(this.scene.getEngine(), this.scene.getCameraByName("ArcRotateCamera"), {
                height: 600,
                width: 800
            }, (data) => {
                FetchHelper.fetch('https://api.xlhb.com/v1/timestorage/push-ts-stage.api', {
                    access_token: sessionStorage.access_token,
                    ts_sign: 'sandplay_screenshot',
                    ts_storage: {
                        image_name: `${window.imagecount++}`,
                        image_base64: data
                    },
                })
            })
        }, 600000)

        this.startRecord() //开始录制
    }

    /**
     * 获取画水操作的对象，在react里面调用
     */
    getDrawer() {
        return this.scene.drawer
    }

    /**
     * 开始录制
     */
    startRecord() {

        this.record = new Record(this.camera)
        setTimeout(() => { //渲染要时间
            this.record.start(this.objs)
        }, 1000)

        //标签页不可见的时候暂停记录
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden') {
                this.record.pause()
            } else {
                this.record.resume()
            }
        })
    }

    /**
     * 结束录制和其他操作，在点完成的时候调用
     */
    stopRecord() {
        //禁止操作
        // console.log(this.objs);
        let ts_storage = [];
        for(let key in this.objs) {
            let obj = {}
            obj.mid = this.objs[key].mid;
            obj.p = this.objs[key].m.position;
            ts_storage.push(obj);
        }
        console.log(ts_storage);
        if (sessionStorage.isTouch === 'true') {
            this.scene.touch.dispose()
        } else {
            this.scene.move.onDispose()
            this.scene.keys.removeTarget()
        }
        this.scene.drawer.disposed()


        //停止记录上传最终截图
        this.record.stop()   //结束录制
        this.camera.setPosition(new BABYLON.Vector3(0, 0, 150))
        clearInterval(this.screenTimer)
        BABYLON.Tools.CreateScreenshotUsingRenderTarget(this.scene.getEngine(), this.scene.getCameraByName("ArcRotateCamera"), {
            height: 600,
            width: 800
        }, (data) => {
            FetchHelper.fetch('https://api.xlhb.com/v1/timestorage/push-ts-stage.api', {
                access_token: sessionStorage.access_token,
                ts_sign: 'sandplay_screenshot',
                ts_storage: {
                    image_name: `${window.imagecount++}`,
                    image_base64: data
                },
            })
        })
        //新增接口
        // FetchHelper.fetch('https://yufaapi.xlhb.com/v1/timestorage/push-last-stage.api', {
        //     access_token: sessionStorage.access_token,
        //     ts_sign: 'sandplay_model_last',
        //     ts_storage: ts_storage,
        // })
    }
}

export default GameScene