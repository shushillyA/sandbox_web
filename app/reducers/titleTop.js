const titleTop = (state={
    scrollTop: 0,
    toyTop: 0,
    toyX:0,
    currentSelect: 0
},action)=>{
    switch (action.type){
        case 'TITLETOP':
            return {
                ...state,
                scrollTop: action.scrollTop,
                toyTop: action.toyTop,
                toyX: action.toyX,
                currentSelect: action.currentSelect
            };
            break;
        default:
            return state
    }
};

export default titleTop