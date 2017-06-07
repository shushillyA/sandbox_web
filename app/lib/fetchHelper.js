import fetch from 'isomorphic-fetch'

class FetchHelper{
    constructor(){
    }
    static fetch(url,parametes){
        let str = ''
        let i = 0
        for(let k in parametes){
            i++
            str += `${i == 1 ? '':'&'}${k}=${typeof parametes[k] == 'object' ? encodeURIComponent(JSON.stringify(parametes[k])):encodeURIComponent(parametes[k])}`
        }
        return fetch(url,{
            method: 'POST',
            mode:'cors',
            headers: {
                Accept: 'application/json',
                "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
            },
            body:str
        }).then(response =>{
            return response.text().then(function(text) {
                return text ? JSON.parse(text) : {}
        })})
    }
}

export default FetchHelper