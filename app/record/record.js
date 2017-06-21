import FetchHelper from '../lib/fetchHelper'

class Record{

    constructor(camera){
        Object.assign(this,{camera})
        this.recordData = []
        this.cp = {x:0,y:0,z:0}
        this.dataKeys = []
        this.interim = 0
    }

    start(objs){
        this.recordData.length = 0
        this.recordStartTime = new Date()
        this.objs = objs
        this.record(objs)
    }

    record(objs){
        this.flag = setTimeout(()=>{this.record(objs)},25)

        let objStatus = {}

        if(this.recordData.length == 0){
            objStatus.t = new Date() - this.recordStartTime - this.interim
            objStatus.c = {p:this.camera.position}
            for(let o in objs){
                if(objs[o].t == 'model'){
                    if(objs[o]['m']) { //是否已经放在桌子上了,没有直接跳过不记录
                        objStatus[o] = {m:o}
                        objStatus[o][o] = {
                            mid:objs[o].mid,
                            p:objs[o].m.position,
                            o:objs[o].o,
                            s:objs[o]['m'].scaling.x,
                            r:objs[o]['m'].rotation.y
                        }
                    }
                }else{//画水的记录
                    objStatus[o] = {m:o}
                    objStatus[o][o] = {mid:objs[o].mid,p:objs[o].m.position,o:objs[o].o}
                }
            }
            this.pushRecord(objStatus)
            return
        }
        if (this.camera.position.x != this.cp.x || this.camera.position.y != this.cp.y || this.camera.position.z != this.cp.z) {
            objStatus.t = new Date() - this.recordStartTime - this.interim
            objStatus.c = {}
            Object.assign(objStatus.c,{x:this.camera.position.x,y:this.camera.position.y,z:this.camera.position.z})
            Object.assign(this.cp,this.camera.position)
            this.pushRecord(objStatus)
            return
        }
        for(let o in objs){
            if (objs[o].o != 0){

                objStatus.t = new Date() - window.startTime
                objStatus[o] = {mid:objs[o].mid}

                switch (objs[o].o){
                    case 1:                   //拉沙具
                        objStatus[o].o = 1
                        objStatus.m = o
                        objStatus[o].mno = objs[o].mno
                        if(objs[o].hasOwnProperty("m")){
                            objs[o].o = 0
                            objStatus[o].p = {}
                            Object.assign(objStatus[o].p,objs[o]['m'].position)
                        }
                        break
                    case 2:                           //移动
                        objStatus[o].o = 2
                        objStatus.m = o
                        objStatus[o].mno = objs[o].mno
                        objStatus[o].p = {}
                        Object.assign(objStatus[o].p,objs[o]['m'].position)
                        break
                    case 3:                          //缩放
                        objStatus[o].o = 3
                        objStatus.m = o
                        objStatus[o].mno = objs[o].mno
                        objStatus[o].s = objs[o]['m'].scaling.x
                        break
                    case 4:                         //旋转
                        objStatus[o].o = 4
                        objStatus.m = o
                        objStatus[o].mno = objs[o].mno
                        objStatus[o].r = objs[o]['m'].rotation.y
                        break
                    case 5:                          //删除
                        objStatus[o].o = 5
                        objStatus.m = o
                        objStatus[o].mno = objs[o].mno
                        delete objs[o]
                        break
                    case 6:                          //画水
                        objStatus[o].o = 6
                        objStatus.w = o
                        objs[o].o = 0
                        objStatus[o].p = objs[o]['m'].position
                        break
                    case 7:                           //删除画水
                        objStatus[o].o = 7
                        objStatus.w = o
                        delete objs[o]
                        break
                }
                this.pushRecord(objStatus)
                return
            }
        }
        this.pushRecord(objStatus)

    }

    pushRecord(objStatus){

        this.recordData.push(Object.assign({},objStatus))

        if(this.recordData.length == 2400){
            if(!PRODUCTION) {
                let key = 'd' + (this.dataKeys.length)
                this.dataKeys.push(key)
                localStorage[key] = JSON.stringify(this.recordData)
            }
            this.upload()
            this.recordData = []
        }
    }

    upload(){
        FetchHelper.fetch(PRODUCTION?'https://yufaapi.xlhb.com/v1/timestorage/push-ts-stage.api':'https://yufaapi.xlhb.com/v1/timestorage/push-ts-stage.api',{
            access_token:sessionStorage.access_token,
            ts_sign:'sandplay_video',
            ts_storage:this.recordData
        }).then((data)=>{
        })
    }

    pause(){
        clearTimeout(this.flag)
        this.pauseTiming = new Date()
    }

    resume(){
        this.record(this.objs)
        this.interim += new Date() - this.pauseTiming
    }

    stop(){
        clearInterval(this.flag)
        if(!PRODUCTION) {
            let key = 'd'+(this.dataKeys.length)
            this.dataKeys.push(key)
            localStorage[key] = JSON.stringify(this.recordData)
            localStorage['dataKeys'] = JSON.stringify(this.dataKeys)
            console.log(this.dataKeys);
        }
        this.upload()
        this.recordData = []

    }

    getRecrdData(){
        return this.recordData
    }
}

export {Record}
