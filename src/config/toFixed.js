// Number.prototype.toFixed = function(length){
//     var carry = 0; //存放进位标志
//     var num, multiple; //num为原浮点数放大multiple倍后的数，multiple为10的length次方
//     var str = this + ''; //将调用该方法的数字转为字符串
//     var dot = str.indexOf("."); //找到小数点的位置
//     if(str.slice(dot + length + 1, dot + length + 2) >= 5) carry = 1; /*找到要进行舍入的数的位置，手动判断是否大于等于5，满足条件进位标志置为1,这里原作者用的是str.substr(dot + length + 1, 1)*/
//     multiple = Math.pow(10, length); //设置浮点数要扩大的倍数
//     num = Math.floor(this * multiple) + carry; //去掉舍入位后的所有数，然后加上我们的手动进位数
//     var result = num / multiple + ''; //将进位后的整数再缩小为原浮点数
//     /*
//     * 处理进位后无小数
//     */
//     dot = result.indexOf(".");
//     if(dot === -1){
//         result += '.';
//         dot = result.indexOf(".");
//     }
//     /*
//     * 处理多次进位
//     */
//     var len = result.length - (dot+1);
//     if(len < length){
//         for(var i = 0; i < length - len; i++){
//             result += 0;
//         }
//     }
//     return result;
// }
//
// export default Number.prototype.toFixed()
