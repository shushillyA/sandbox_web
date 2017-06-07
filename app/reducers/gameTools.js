const gameTools = (state={finish:false,helper:false,lock:false,music:false},action)=>{
    switch (action.type){
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