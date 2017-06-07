
const upload = (state = {
    video:false,
    operation:false
},action)=>{
    switch (action.type){
        case 'OPERATION':
            return{...state,operation:true}
        case 'VIDEO':
            return{...state,video:true}
        default:
            return state
    }
}

export default upload