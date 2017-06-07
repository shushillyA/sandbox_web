/**
 * Created by leolong on 2017/5/15.
 */

export const leapAction = (currentTime)=>{
    return {
        type:'PLAYLEAP',
        currentTime
    }
}
export const totalTime = (totalTime)=>{
    return {
        type:'TOTALTIME',
        totalTime
    }
}
export const bufferBar = (bufferPercent)=>{
    return {
        type:'BUFFERBAR',
        bufferPercent
    }
}
