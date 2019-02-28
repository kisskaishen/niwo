import Vue from 'vue'
import FileSaver from 'file-saver';

const Json2csvParser = require('json2csv').Parser;
// Json2csvParser.parse(rows, { fields: fields,excelStrings:true})
// const fields = ['resultTime','identityCard', 'projectId',
const fields = ['日期','身份证', '标ID',
    '在其它网贷平台累计逾期平台数','在其它网贷平台有最长逾期天数＞90天的借款，且该笔逾期金额＞1000元的笔数','projectId']
const datetime = Date.now();
const exportCSV = (data, fields=fields, filename = `${datetime}.csv`) => {
    const parser = new Json2csvParser({fields,unwindBlank: true});
    const csvData = parser.parse(data);
    const blob = new Blob(["\uFEFF"+csvData], {type: 'text/plain;charset=utf-8'});
    // const blob = new Blob([csvData], {type: 'text/plain;charset=utf-8;'});//charset=utf-8乱码
    FileSaver.saveAs(blob, filename);
}

// const json2csv = require('json2csv');
// const fs = require('fs');
// const fields = [];
// const data = []
// let exportCSV = (data,fields)=>{
//     json2csv({ data: arr, fields: fields });
// }
// fs.writeFile('file.csv', exportCSV, function(err) {
//     if (err) throw err;
//     console.log('file saved');
// });
export default {
    install(Vue) {
        Vue.prototype.$exportCSV = exportCSV;
    }
}

