import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';


const Cell = ({ columnIndex, rowIndex, style, data }) => {
    // null cell
    if (!data[rowIndex] || !data[rowIndex][columnIndex]) {
      return <div style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ddd',
        background: rowIndex % 2 ? 'white' : 'lightgray' // 交替颜色提高可读性
      }}> </div>;
    }
  
    const cell = data[rowIndex][columnIndex];
    // 再次检查 cell 是否有 value 属性
    if (!cell || cell.value === undefined) {
      return <div style={style}>No value</div>;
    }
    return (
    <div style={{
    ...style,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ddd',
    background: rowIndex % 2 ? 'white' : 'lightgray' // 交替颜色提高可读性
  }}>
    {cell.value}
  </div>
  )
};

export const VirtualizedSpreadsheet = ({ data }) => {
  const columnCount = data[0].length; 
  const rowCount = data.length;

  return (
    <Grid
      columnCount={columnCount}
      columnWidth={150} // 根据实际内容调整列宽
      rowCount={rowCount}
      rowHeight={80} // 根据实际内容调整行高
      height={1500} // 可视区域高度，根据需要调整
      width={4000} // 可视区域宽度，根据需要调整
      itemData={data} // 传递数据到格子组件
    >
      {Cell}
    </Grid>
  );
};

