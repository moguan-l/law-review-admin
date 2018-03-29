const Main = ({filename = 'unnamed', columns, data}) => {
    if (!columns || !columns.length) {
        return console.warn('需要传入表头');
    }
    /*处理表头*/
    let tableHeader = columns.map(item => {
        return {
            value: item.title
        }
    });
    /*处理表数据*/
    let tableData = data.map(item => {
        let rowData = [];
        columns.forEach(_item => {
            rowData.push({
                value: item[_item.key],
                dataType: _item.type
            })
        });
        return rowData
    });
    /*组装excel*/
    let excel = ['<table>'];
    // 表头
    let row = ['<tr>'];
    tableHeader.forEach(item => {
        row.push(`<td>${item.value}</td>`)
    });
    row.push('</tr>');
    excel.push(row.join(''));
    // 表数据
    tableData.forEach(item => {
        let row = ['<tr>'];
        item.forEach(_item => {
            row.push(`<td${_item.dataType === 'string' ? ' style="mso-number-format:\'\@\';"' : ''}>${_item.value || ''}</td>`)
        });
        row.push('</tr>');
        excel.push(row.join(''));
    });
    excel.push('</table>');

    let excelFile = [
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">',
        '<head>',
        '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">',
        '<!--[if gte mso 9]>',
        '<xml>',
        '<x:ExcelWorkbook>',
        '<x:ExcelWorksheets>',
        '<x:ExcelWorksheet>',
        '<x:Name>',
        '{worksheet}',
        '</x:Name>',
        '<x:WorksheetOptions>',
        '<x:DisplayGridlines/>',
        '</x:WorksheetOptions>',
        '</x:ExcelWorksheet>',
        '</x:ExcelWorksheets>',
        '</x:ExcelWorkbook>',
        '</xml>',
        '<![endif]-->',
        '</head>',
        '<body>',
        excel.join(''),
        '</body>',
        '</html>',
    ];
    /*生成文件*/
    let uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile.join(''));
    /*下载文件*/
    let link = document.createElement('a');
    link.href = uri;
    link.style.visibility = 'hidden';
    link.download = filename + '.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default Main