/**
 * Created by leolong on 2017/5/11.
 */
class PlayDraw{
    constructor(scene){
        this.scene = scene
        this.init()
    }
    init(){                                                                    //初始化材料，和画水。用于后期的创建instance
        this.decalMaterial = new BABYLON.StandardMaterial("decalMat", this.scene);
        this.decalMaterial.emissiveColor = new BABYLON.Color3(0.2,0.6,0.8)
        this.decalMaterial.specularColor = new BABYLON.Color3(0,0,0)
        this.decalMaterial.diffuseColor = new BABYLON.Color3(0,0,0)
        this.mesh = BABYLON.Mesh.CreateDisc("water",4,20,this.scene)         //半径4，细度20（越大越圆滑）
        this.mesh.material = this.decalMaterial
        this.mesh.rotation.x = Math.PI/2                           //围绕x轴逆时针旋转pi/2，试正面朝上
        this.mesh.position = new BABYLON.Vector3(-5000,0,0)         //放远一点，不要出现在视线内
    }
    draw(p,key){
        if(this.scene.objs[key]){                 //如果已经存在了就直接替换位置
            console.log(p)
            this.scene.objs[key].position = p
        }else {
            let newWater = this.mesh.createInstance(key)      //创建一个新的画水，圆面
            newWater.position.x = p.x
            newWater.position.y = p.y
            newWater.position.z = p.z
            this.scene.objs[key] = newWater
        }
    }
}

export default PlayDraw
