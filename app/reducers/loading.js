
const loading = (state={
    isLoad:true
},action) =>{
    switch (action.type){
        case 'CLOSELOADING':
                return {...state,isLoad:false}
        default:
            return state
    }
};

export default loading;