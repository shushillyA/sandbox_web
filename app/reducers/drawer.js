const drawer = (state={draw:false,erase:false},action)=>{
    switch (action.type){
        case 'DRAW':
            return {
                ...state,
                draw:action.operation
            }
        case 'ERASE':
            return {
                ...state,
                erase:action.operation
            };
        default:
            return state
    }
};

export default drawer
