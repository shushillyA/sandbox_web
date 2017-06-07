/**
 * Created by leolong on 2017/5/15.
 */
const playReducer = (state={
    totalTime:0,
    currentTime:0,
    bufferPercent:0,
    play:false
},action) =>{
    switch (action.type){
        case 'PLAYLEAP':
            return {...state,currentTime:action.currentTime}
        case 'TOTALTIME':
            return {...state,totalTime:action.totalTime}
        case 'BUFFERBAR' :
            return {...state,totalTime:action.bufferPercent}
        default:
            return state
    }
}

export default playReducer;
