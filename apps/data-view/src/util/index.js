
//对象深拷贝函数
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function formatTimestamp(timestamp) {
    var date = new Date(timestamp); // 后端返回的数据时间戳已精确到ms，所以不需要*1000
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // getMonth()返回的月份是从0开始的，所以需要+1
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}
function formatTimestamp2(timestamp) {
    var date = new Date(timestamp); // 后端返回的数据时间戳已精确到ms，所以不需要*1000
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // getMonth()返回的月份是从0开始的，所以需要+1
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);
    return hours+":"+minutes + ":" + seconds;
}
export {
    deepCopy,
    formatTimestamp,
    formatTimestamp2
} 