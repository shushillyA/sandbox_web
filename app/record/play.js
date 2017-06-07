/**
 * Created by leolong on 2017/5/10.
 */
import PlayLoader from './playLoader'
import PlayDraw from './playDraw'
import {totalTime, leapAction, bufferBar} from '../actions/playAction'

class Play {
    constructor(scene) {
        Object.assign(this, {scene})
        this.current = 0
        this.dataIndex = JSON.parse(localStorage['dataKeys'])
        this.dataCount = this.dataIndex.length
        this.recordDatas = new Array(this.dataIndex.length).fill(false)
        this.playDraw = new PlayDraw(this.scene)
        this.playLoader = new PlayLoader(this.scene, this.playDraw)


        //init                                           开始加载前两分钟的记录
        this.getNextRecordDatas(0)
            .then(() => {
                this.start(this.current, 0)           //开始播放
            })

        let lastSeconds = JSON.parse(localStorage[this.dataIndex[this.dataIndex.length - 1]]).length   //获取最后一分钟，因为最后一分钟，不一定是满的一分钟，需要算多出几秒，可以让后台提供长度啊
        this.totalTime = (this.dataIndex.length - 1) * 60 + Math.ceil(lastSeconds / 40)   //算出总长度，更新state
        this.scene.dispatch(totalTime(this.totalTime))

        console.log(lastSeconds);
        console.log(this.dataIndex);
    }

    loading(current, position) {             //跳转时的加载记录数据
        clearTimeout(this.playFlag)          //停止播放
        this.current = current
        if (!this.recordDatas[current]) {    //如果没有缓存的，先缓存，在这里dispatch缓存开始state，在缓存动画
            this.getNextRecordDatas(current)
                .then(() => {
                    this.leap(current, position)
                })
        } else {
            this.leap(current, position)
        }
    }

    leap(current, position) {

        let tempSandToyStatus = {}   //记录所有从开始到跳转的点进行的操作后沙具和水的最终状态
        let sandToyList = []         //从开始到节点新增加的沙具，用于缓冲
        let waterList = []           //从开始到节点新增加的画水

        //第一帧还原场景，用于跳转
        let f = this.recordDatas[current][0]
        for (let objsKey in this.scene.objs) { //第一帧的复位，隐藏现有的沙具，不删除，因为可以回再跳回来
            if (objsKey[0] === 'w') {
                this.scene.objs[objsKey].position.y = -15 //隐藏水，instance不能设置visibility
            } else {
                this.scene.objs[objsKey].visibility = 0 //隐藏
            }
        }

        for (let key in f) { //第一帧的复位，改变所有沙具的位置
            let frame = f[key]
            if (key === 't') {//时间戳
                continue
            } else if (key === 'c') { //相机位置
                tempSandToyStatus['c'] = {}
                tempSandToyStatus['c'].p = {...frame.p}      //位置不这样赋值，会指针赋值
            } else {
                let sandToyStatus = frame[frame.m]           //看记录结构文档
                tempSandToyStatus[key] = {
                    visibility: 1,
                    position: {...sandToyStatus.p},
                    scaling: sandToyStatus.s,
                    rotation: sandToyStatus.r
                }

                if (!this.scene.objs[key]) {                 //是否已经加载过的水或者沙具，不是则加到缓存列表
                    if (key[0] === 'm') {                     //判断是水还是沙具
                        sandToyList.push({ms: key, mid: sandToyStatus.mid, p: {...sandToyStatus.p}})
                    } else {
                        waterList.push({ms: key, p: {...sandToyStatus.p}})
                    }
                }
            }
        }

        for (let i = 1; i <= position; i++) {
            let
                data = this.recordDatas[current][i]

            if (!data.t)
                continue                                        //没有操作

            if (data.c) {                                        //相机事件
                tempSandToyStatus['c'].p = {...data.c}           //记录相机的位置
                continue
            }

            let modelKey = data.m ? data.m : data.w              //获取记录对象里面的记录数据
            let model = data[modelKey]                           //赋值出来记录数据

            switch (model.o) {
                case 1:                                          //拉沙具下来
                    if (model.p) {                               //是否有position，有就是已经放下，没有就是还没有放下
                        tempSandToyStatus[modelKey] = {
                            visibility: 1,
                            position: {...model.p},
                            scaling: 1,
                            rotation: Math.PI
                        }
                        if (!this.scene.objs[modelKey])           //如果还没有加载过就放入缓冲数组
                            sandToyList.push({
                            ms: modelKey,
                            mid: model.mid,
                            p: {...model.p}
                        })
                    }
                    break
                case 2:                                            //移动沙具，改变临时记录的位置
                    tempSandToyStatus[modelKey].position = {...model.p}
                    break
                case 3:                                           //放大缩小
                    tempSandToyStatus[modelKey].scaling = model.s
                    break
                case 4:                                            //旋转
                    tempSandToyStatus[modelKey].rotation = model.r
                    break
                case 5:                                             //删除，直接隐藏不删除。下次跳转回来可以快速的调用
                    tempSandToyStatus[modelKey].visibility = 0
                    break
                case 6:                                            //画水
                    tempSandToyStatus[modelKey] = {visibility: 1, position: {...model.p}}
                    if (!this.scene.objs[modelKey]) waterList.push({ms: modelKey, p: {...model.p}})
                    break
                case 7:                                             //擦除画水
                    tempSandToyStatus[modelKey].visibility = 0
                    break
            }
        }
        this.playLoader.setLoadList(sandToyList, waterList, tempSandToyStatus, () => {   //调用加载沙具方法，加载完后继续播放
            this.start(current, position)
        })
    }

    start(current, position) {                                         //播放方法
        this.playFlag = setTimeout(() => {
            if (++position === 2400) {                                 //测试只播1000帧
                current++
                position = 1                                          //上一个是最后一帧，不是跳转不用还原
                if (current < this.dataIndex.length) {
                    this.getNextRecordDatas(current)                  //有了的会自动加载下一分钟
                }
                //return
            }
            if (position % 40 === 0) {
                this.scene.dispatch(leapAction(current * 60 + (position / 40)))
            }
            this.start(current, position)
        }, 25)

        if (!this.recordDatas[current][position]) {
            clearTimeout(this.playFlag);
            console.log("finish");
            return
        }

        let data = this.recordDatas[current][position]
        if (!data.t) return //没有操作

        if (data.c) {//相机事件
            let cp = data.c
            this.scene.cameras[0].setPosition(new BABYLON.Vector3(cp.x, cp.y, cp.z))
            return
        }

        let modelKey = data.m ? data.m : data.w
        let model = data[modelKey]

        switch (model.o) {
            case 1:
                if (model.p) {                              //是否有position，有就是已经放下，没有就是还没有放下，可以用于触发拉沙具提示
                    this.playLoader.setLoadList([{ms: modelKey, mid: model.mid, p: {...model.p}}])
                }
                break
            case 2:
                this.scene.objs[modelKey].position = {...model.p}
                break
            case 3:
                this.scene.objs[modelKey].scaling.x = model.s
                this.scene.objs[modelKey].scaling.y = model.s
                this.scene.objs[modelKey].scaling.z = model.s
                break
            case 4:
                this.scene.objs[modelKey].rotation.y = model.r
                break
            case 5:
                this.scene.objs[modelKey].visibility = 0
                delete this.scene.objs[modelKey]
                break
            case 6:
                this.playDraw.draw({...model.p}, modelKey)
                break
            case 7:
                this.scene.objs[modelKey].position.y = -15
                break
        }
    }

    pause() {                                                                             //暂停方法
                                                                                   //在这里解绑相机控制，在start再开始
    }

    getNextRecordDatas(next) {
        return new Promise((resolve, reject) => {
            if(!this.recordDatas[next] && next<this.dataCount) {                              //如果没有加载就要加载
                this.recordDatas[next] = JSON.parse(localStorage[this.dataIndex[next]])
                this.scene.dispatch(bufferBar(100 * (next / this.dataCount)))
            }
            if (!this.recordDatas[next + 1] && (next + 1) < this.dataCount && next === (this.current + 1)) //只往后加载一分钟
                this.getNextRecordDatas(next + 1)
            resolve()
        })
    }
}
export default Play