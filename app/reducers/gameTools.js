const gameTools = (state={finish:false,helper:false,lock:false,music:false},action)=>{
    console.log(action.type, '状态设置')
    console.log(state, '状态对象')
    switch (action.type){    // 这边改变finish状态
        case 'GAMEFINISH':
            return {
                ...state,
                finish:!state.finish
            }
        case 'GAMELOCK':
            return {
                ...state,
                lock:!state.lock
            }
        case 'GAMEMUSIC':
            return {
                ...state,
                music:!state.music
            }
        default:
            return state
    }
}

export default gameTools