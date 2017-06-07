class GetTime{
    static getCurrentTime() {
        let time = ``
        let curDate = new Date();
        let month = curDate.getMonth() + 1;
        let date = curDate.getDate();
        let hours = curDate.getHours();
        let minutes = curDate.getMinutes();
        let seconds = curDate.getSeconds();

        month = month < 10 ? `0` + month : month
        date = date < 10 ? `0` + date : date
        hours = hours < 10 ? `0` + hours : hours
        minutes = minutes < 10 ? `0` + minutes : minutes
        seconds = seconds < 10 ? `0` + seconds : seconds

        time = `${curDate.getFullYear()}-${month}-${date} ${hours}:${minutes}:${seconds}`

        return time
    }
    static timeDuration(start,end){
        var date3=end.getTime()-start.getTime()
        //var days=Math.floor(date3/(24*3600*1000))
        var leave1=date3%(24*3600*1000)
        var hours=Math.floor(leave1/(3600*1000))
        var leave2=leave1%(3600*1000)
        var minutes=Math.floor(leave2/(60*1000))
        var leave3=leave2%(60*1000)
        var seconds=Math.round(leave3/1000)
        return `${hours}小时${minutes}分${seconds}秒`
    }
}

export default GetTime