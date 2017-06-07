class GetCookie{
    constructor(){
    }
    static get(Name) {
        let search = Name + "="//查询检索的值
        let returnvalue = "";//返回值
        if (document.cookie.length > 0) {
            let sd = document.cookie.indexOf(search);
            if (sd!= -1) {
                sd += search.length;
                let end = document.cookie.indexOf(";", sd);
                if (end == -1)
                    end = document.cookie.length;
                //unescape() 函数可对通过 escape() 编码的字符串进行解码。
                returnvalue=unescape(document.cookie.substring(sd, end))
                returnvalue = returnvalue.substring(1)
            }
        }
        return returnvalue;
    }
}

export default GetCookie
