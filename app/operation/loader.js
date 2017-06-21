import FetchHelper from '../lib/fetchHelper'

class Loader {
    constructor(scene, objs) {
        Object.assign(this, {scene, objs})
        this.id = 0
        this.loadList = []
    }

    /**
     *
     * @param position 放下的位置
     * @param id   沙具的id
     * @param ms   沙具的名字
     * @param loadIcon 缩略图
     */
    loadListAdd(position, id, ms, loadIcon) { //缓冲load区，一个一个的加载，其他的看回放的，一样的
        FetchHelper.fetch('https://yufaapi.xlhb.com/v1/sandbox/sandbox-model.api', {
            model_id: id,
            token: sessionStorage.access_token
        })
            .then((json) => {
                let rootUrl = `https://yufaapi.xlhb.com/v1/sandbox/sandbox-encrypt.api?rootUrl=${json.data.obj_url}/&model_id=${id}&version=${json.data.version}&fileName=`
                let fileName = json.data.obj_file
                fetch(rootUrl + fileName).then((response) => {
                    return response.blob();
                }).then((myBlob) => {
                    let iv = navigator.userAgent.substr(0, 8) + (json.data.obj_file).split('.obj')[0] + json.data.version
                    this.loadList.push(Object.assign({}, {position, ms, loadIcon, iv, rootUrl, fileName}))
                    if (this.loadList.length === 1) {
                        this.load(this.loadList[0])
                    }
                });
            })
    }

    load(loadData) {
        sessionStorage.iv = loadData.iv

        let loader = new BABYLON.AssetsManager(this.scene)
        loader.useDefaultLoadingScreen = false
        let obj = loader.addMeshTask(loadData.ms, "", loadData.rootUrl, loadData.fileName)

        obj.onSuccess = (t) => {
            this.onSuccess(t, loadData.position, loadData.ms, loadData.loadIcon)
        }
        loader.load()
    }

    onSuccess(t, position, ms, loadIcon) {
        if (!PRODUCTION) console.log(t.loadedMeshes.length) //超过1就是没有融合，用于检查沙具

        this.scene.getMeshByName(`loading${ms}`).dispose()   //删掉loading标识
        loadIcon.dispose()                                     //删除缩略图


        t.loadedMeshes.forEach((m) => {
            m.position = position
            m.position.y += 1
            m.rotation.y = Math.PI                    //默认旋转180度，正面朝前
            m.msId = ms
            this.objs[ms].m = m
            BABYLON.Tags.AddTagsTo(m, "sandToy")        //加tag
        })
        if (window.imagecount === 1) {                //如果是第一个沙具就截图上传
            BABYLON.Tools.CreateScreenshotUsingRenderTarget(this.scene.getEngine(), this.scene.getCameraByName("ArcRotateCamera"), {
                height: 600,
                width: 800
            }, (data) => {
                FetchHelper.fetch('https://yufaapi.xlhb.com/v1/timestorage/push-ts-stage.api', {
                    access_token: sessionStorage.access_token,
                    ts_sign: 'sandplay_screenshot',
                    ts_storage: {
                        image_name: `${window.imagecount++}`,
                        image_base64: data
                    },
                })
            })
        }
        this.loadList.shift()//加载完之后删除
        if (this.loadList.length !== 0) this.load(this.loadList[0])
    }
}

export {Loader}
