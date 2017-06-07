const getToy = (state={
    data:{1:[],2:[]},
    isInit:false
},action)=>{
    switch (action.type){
        case 'GETTOY':
            return {...state, data: action.text, isInit: true};
            break;
        default:
            return state
    }
};

export default getToy