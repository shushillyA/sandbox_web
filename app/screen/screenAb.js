import {closeloading} from '../actions/index'

class ScreenAb {
    constructor(dispatch) {
        let canvas = document.getElementById("renderCanvas")
        let engine = new BABYLON.Engine(canvas, true)
        engine.enableOfflineSupport = false //取消assets本地存储，不再报manifest错误
        // engine.setHardwareScalingLevel(720.0 / window.innerHeight)//跑720p
        let scene = new BABYLON.Scene(engine)
        scene.clearColor = new BABYLON.Color3(255, 255, 255) //scene背景色
        //scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3) //环境光
        scene.isDraw = false //画水的时候不能进行其他操作
        let camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene)
        camera.setTarget(BABYLON.Vector3.Zero()) //相机观察点
        camera.setPosition(new BABYLON.Vector3(0, 0, 150))
        camera.attachControl(canvas, false,false) //绑定相机操作
        camera.lowerBetaLimit = 0.1 //最高角度
        camera.upperBetaLimit = 1.5 //最低角度
        camera.lowerRadiusLimit = 10 //最近距离
        camera.upperRadiusLimit = 150 //最远距离

        //灯光
        new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene)
        var light1 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
        light1.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);
        light1.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
        light1.groundColor = new BABYLON.Color3(0, 0, 0);

        let ground = BABYLON.Mesh.CreateGround('ground1', 90, 90, 2, scene) //桌面
        ground.position.y = -13
        let groundMat = new BABYLON.StandardMaterial('groundMat', scene) //桌面材料
        ground.material = groundMat
        groundMat.diffuseTexture = new BABYLON.Texture(ASSETS +(PRODUCTION ? '../assest/':'assets/')+ "texture/sand.jpg", scene) //桌面贴图
        groundMat.emissiveColor = new BABYLON.Color3(1,1,1)
        groundMat.specularColor = new BABYLON.Color3(0,0,0)


        //选中标记
        let selectedSign = new BABYLON.Mesh.CreatePlane("selectedSign", 5, scene)
        selectedSign.material = new BABYLON.StandardMaterial('selectedSignMat', scene)
        selectedSign.material.diffuseTexture = new BABYLON.Texture(ASSETS + (PRODUCTION ? '../assest/':'assets/')+`texture/${sessionStorage.isTouch === 'true' ? 'close' : 'selectedSign'}.png`, scene)
        selectedSign.material.diffuseTexture.hasAlpha = true //是否支持透明
        selectedSign.material.emissiveColor = new BABYLON.Color3(1, 1, 1) //自发光
        selectedSign.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y //面向相机
        selectedSign.visibility = 0 //是否可见
        BABYLON.Tags.AddTagsTo(selectedSign, "operation") //添加tag

        Object.assign(this, {camera, engine, scene, canvas, ground, selectedSign})

        this.roomInit()
        //加载desk的obj
        let loader = new BABYLON.AssetsManager(scene)
        loader.useDefaultLoadingScreen = false
        let desk = loader.addMeshTask("desk", "", `${PRODUCTION ? '../assest' : 'assets'}/desk/desk.obj?rootUrl=${PRODUCTION ? '../assest' : 'assets'}/desk/&model_id=-100&fileName=`, "desk.obj")
        desk.onSuccess = (t) => { //加载成功操作
            t.loadedMeshes.forEach((m, i) => {
                m.scaling.x = m.scaling.y = m.scaling.z = 0.25
                m.position.y = -50 //下移50
            })
            setTimeout(()=>{dispatch(closeloading())},350) //关闭加载页面
        }

        if (!PRODUCTION) { //开发环境加上帧数
            this.div = document.createElement("div")
            this.div.style.position = 'absolute'
            this.div.style.index = '1000'
            this.div.style.top = '0'
            document.querySelectorAll('body')[0].appendChild(this.div)
        }

        loader.load()

        engine.runRenderLoop(() => {       //渲染周期
            scene.render()
            if (!PRODUCTION) {
                this.div.innerText = engine.getFps().toFixed()
            }
        })

        window.addEventListener("resize", () => {
            engine.resize()
        })
        this.sceneOptimize() //场景优化
    }

    sceneOptimize() {

        let moderateOptimizer = new BABYLON.SceneOptimizerOptions(60, 2000)
        moderateOptimizer.optimizations.push(new BABYLON.PostProcessesOptimization(0))
        moderateOptimizer.optimizations.push(new BABYLON.TextureOptimization(0, 256))
        moderateOptimizer.optimizations.push(new BABYLON.RenderTargetsOptimization(1))

        BABYLON.SceneOptimizer.OptimizeAsync(this.scene, moderateOptimizer)

    }

    roomInit() {
        //为了贴图清楚自己模拟房间，sky dome不清楚
        //墙1
        let wall_pz = new BABYLON.Mesh.CreatePlane('wall_pz', 400, this.scene)
        wall_pz.material = new BABYLON.StandardMaterial('wall_pz', this.scene)
        wall_pz.material.diffuseTexture = new BABYLON.Texture(ASSETS + (PRODUCTION ? '':'assets/') + 'texture/wall/room_pz.jpg', this.scene)
        wall_pz.material.specularcolor = new BABYLON.Color3(0, 0, 0)
        wall_pz.material.emissiveColor = new BABYLON.Color3(1, 1, 1)
        wall_pz.position.z = 200
        wall_pz.position.y = 50
        wall_pz.scaling.y = 0.5

        let wall_nz = new BABYLON.Mesh.CreatePlane('wall_pz', 400, this.scene)
        wall_nz.material = new BABYLON.StandardMaterial('wall_pz', this.scene)
        wall_nz.material.diffuseTexture = new BABYLON.Texture(ASSETS + (PRODUCTION ? '':'assets/') + 'texture/wall/room_nz.jpg', this.scene)
        wall_nz.material.emissiveColor = new BABYLON.Color3(0.9, 0.9, 0.9)
        wall_nz.material.backFaceCulling = false
        wall_nz.position.z = -200
        wall_nz.position.y = 50
        wall_nz.scaling.y = 0.5

        let wall_nx = new BABYLON.Mesh.CreatePlane('wall_pz', 400, this.scene)
        wall_nx.material = new BABYLON.StandardMaterial('wall_pz', this.scene)

        wall_nx.material.diffuseTexture = new BABYLON.Texture(ASSETS + (PRODUCTION ? '':'assets/') + 'texture/wall/room_nx.jpg', this.scene)
        wall_nx.material.emissiveColor = new BABYLON.Color3(0.95, 0.95, 0.95)
        wall_nx.position.x = -200
        wall_nx.position.y = 50
        wall_nx.scaling.y = 0.5
        wall_nx.rotation.y = -Math.PI / 2

        let wall_px = new BABYLON.Mesh.CreatePlane('wall_pz', 400, this.scene)
        wall_px.material = new BABYLON.StandardMaterial('wall_pz', this.scene)
        wall_px.material.diffuseTexture = new BABYLON.Texture(ASSETS + (PRODUCTION ? '':'assets/') + 'texture/wall/room_px.jpg', this.scene)
        wall_px.material.emissiveColor = new BABYLON.Color3(0.95, 0.95, 0.95)
        wall_px.position.x = 200
        wall_px.position.y = 50
        wall_px.scaling.y = 0.5
        wall_px.rotation.y = Math.PI / 2

        //天花板
        let c = new BABYLON.Mesh.CreatePlane('wall_py', 400, this.scene)
        c.material = new BABYLON.StandardMaterial('wall_py', this.scene)
        c.material.diffuseTexture = new BABYLON.Texture(ASSETS + (PRODUCTION ? '':'assets/') + 'texture/wall/room_py.jpg', this.scene)
        c.material.emissiveColor = new BABYLON.Color3(0.85, 0.85, 0.85)
        c.position.y = 150
        c.rotation.x = -Math.PI / 2

        //地面
        let floor = new BABYLON.Mesh.CreatePlane('floor', 400, this.scene)
        floor.material = new BABYLON.StandardMaterial('floor', this.scene)

        floor.material.emissiveTexture = new BABYLON.Texture(ASSETS + (PRODUCTION ? '':'assets/') + 'texture/wall/room_ny.jpg', this.scene)
        floor.material.diffuseColor = new BABYLON.Color3(0, 0, 0)
        floor.material.specularColor = new BABYLON.Color3(0, 0, 0)
        floor.position.y = -50
        floor.rotation.x = Math.PI / 2
    }
}

export default ScreenAb