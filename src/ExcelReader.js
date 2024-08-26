import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useTable } from 'react-table';

function ExcelReader() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  // 处理文件上传
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const { result } = event.target;
      const workbook = XLSX.read(result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const cols = makeColumns(XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0]);
      setColumns(cols);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  // 生成列配置
  const makeColumns = (headers) => {
    return headers.map((header) => ({
      Header: header,
      accessor: header,
    }));
  };

  // 使用 react-table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls, .csv" />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ExcelReader;
