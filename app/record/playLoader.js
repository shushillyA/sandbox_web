import FetchHelper from '../lib/fetchHelper'

class PlayLoader {
    constructor(scene,playDraw) {
        Object.assign(this, {scene})
        this.importBuffer = []           //缓冲list
        this.playDraw = playDraw
        this.loadCount = 0               //要加载的数据的个数
    }
    loadfinish(){
        for(let w of this.waterList){    //画水
            this.playDraw.draw(w.p,w.ms)
        }

        for(let key in this.tempSandToyStatus){  //还原场景
            if(key[0] === 'w'){                    //是画水还是沙具
                if(this.tempSandToyStatus[key].visibility === 1) { //是否显示
                    this.scene.objs[key].position.y = -12          //显示
                }else
                    this.scene.objs[key].position.y = -15           //不显示，陷入桌子里面，就会被桌子挡住就看不到了，因为instance不能设置visibility
            }else if(key !== 'c'){                                 //沙具
                this.scene.objs[key].position = this.tempSandToyStatus[key].position
                this.scene.objs[key].scaling.x = this.scene.objs[key].scaling.y = this.scene.objs[key].scaling.z = this.tempSandToyStatus[key].scaling
                this.scene.objs[key].rotation.y = this.tempSandToyStatus[key].rotation
                this.scene.objs[key].visibility = 1
            } else{                                                  //相机
                let cp = this.tempSandToyStatus[key].p
                this.scene.cameras[0].setPosition(new BABYLON.Vector3(cp.x, cp.y, cp.z))
            }
        }
        this.callback()
    }

    /**
     * loadList 要加载的沙具数组
     * waterList要新加的水
     * tempSandToyStatus从当前记录一直到调整帧操作后的最终状态
     */
    setLoadList(loadList,waterList,tempSandToyStatus,callback) {
        this.loadCount = 0 //还原已加载个数
        this.loadList = loadList
        this.waterList = waterList
        this.tempSandToyStatus = tempSandToyStatus
        this.callback = callback
        if(loadList.length === 0 && this.waterList) this.loadfinish()                            //没有要下载的沙具，直接跳到完成方法

        for (let loadData of loadList) {
            FetchHelper.fetch('https://api.xlhb.com/v1/sandbox/sandbox-model.api', {        //获取沙具的信息
                model_id: loadData.mid,
                token: "sess_538f84a87d0018a97dfdb27c740013ea"                                     //应该由后台传过来
            })
                .then((json) => {
                    let rootUrl = `https://api.xlhb.com/v1/sandbox/sandbox-encrypt.api?rootUrl=${json.data.obj_url}/&model_id=${loadData.mid}&version=${json.data.version}&fileName=`
                    let fileName = json.data.obj_file

                    fetch(rootUrl + fileName).then((response) => {                   //下载浏览器缓存
                        return response.blob();
                    }).then((myBlob) => {
                        let iv = navigator.userAgent.substr(0, 8) + (json.data.obj_file).split('.obj')[0] + json.data.version    //解密的iv

                        this.importBuffer.push({iv: iv, modelSign: loadData.ms, rootUrl: rootUrl, fileName: fileName,position:loadData.p})
                        if (this.importBuffer.length === 1) this.load() //如果只有一个在加载list数组就直接渲染
                    });
                })
        }
    }

    load() {
        let loadData = this.importBuffer[0]                               //获取最先进来的沙具信息
        let loader = new BABYLON.AssetsManager(this.scene)                //创建loader方法
        loader.useDefaultLoadingScreen = false
        let obj = loader.addMeshTask(loadData.modelSign, "", loadData.rootUrl, loadData.fileName)   //loader准备，（模型名字，，模型目录，模型名字）
        sessionStorage.iv = loadData.iv                                   //把iv存在seesionStorage用于解密

        obj.onSuccess = (t) => {                                           //成功的回调
            t.loadedMeshes.forEach((m) => {
                this.scene.objs[loadData.modelSign] = m                  //加入到objs里面，objs用来储存沙具的
                m.position = loadData.position
                m.position.y += 1                                         //向上移一位，使之不陷入桌子里面
                m.rotation.y = Math.PI                                     //沙具默认朝前
            })
            this.importBuffer.shift()                                     //加载完后从list中移除
            this.loadCount++
            if(this.loadCount === this.loadList.length && this.waterList) this.loadfinish() //如果等于一共要加载的沙具个数，和是否有画水数组（表示是跳转的，不是播放的）
            if (this.importBuffer.length !== 0) this.load()                                 //缓冲还有就继续下载
        }
        loader.load()                                                   //开始加载
    }
}

export default PlayLoader
