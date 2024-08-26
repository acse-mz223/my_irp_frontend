import React, { useState, useEffect } from 'react';
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom"
import * as XLSX from 'xlsx';
import {MainPage} from './MainPage'
import {About} from "./About.js"
import {Data} from './Data';
import {Figure6} from './Figure6';
import {Figure7} from './Figure7';
import {Figure8} from './Figure8';
import {Figure9} from './Figure9';
import { Distribution } from './Distribution';


export function App(){
  // get data
  // set state
  const [data, setData] = useState([]);
  // fetch data
  useEffect(() => {
    fetch('./Capacity Estimates Data.xlsx')
      .then((res) => res.arrayBuffer())  //将响应体转换成 ArrayBuffer 对象，也用于处理二进制数据
      .then((ab) => {
        const workbook = XLSX.read(ab);  // read data
        const worksheetName = workbook.SheetNames[0]; // get sheet name 
        const worksheet = workbook.Sheets[worksheetName]; // get sheet content
        const json = XLSX.utils.sheet_to_json(worksheet, {header: 1}); // trans to json
        console.log(json)
        const formattedData = json.map(row => 
          row.map(cell => ({ value: cell ?? "" }))  //react-spreadsheet need data in form: [{value: X}, {value: Y}]
                                                    // [] means one row, {} means one cell
        );
        setData(formattedData);
      });
  }, []);

  // state -- hide menu
  const [menuHidden, setMenuHidden] = React.useState(false)

  // router
  const router = createBrowserRouter([
    {
    path: "/",
    element: <MainPage setMenuHidden={setMenuHidden} menuHidden={menuHidden}/>,
    children:[
      {
        path: "/",
        element: <About menuHidden={menuHidden}/>
      },
      {
      path: "Data",
      element: <Data data={data} menuHidden={menuHidden}/>
      },
      {
      path: "Figure6",
      element: <Figure6 data={data} menuHidden={menuHidden}/>
      },
      {
      path: "Figure7",
      element: <Figure7 data={data} menuHidden={menuHidden}/>
      },
      {
      path: "Figure8",
      element: <Figure8 data={data} menuHidden={menuHidden}/>
      },
      {
      path: "Figure9",
      element: <Figure9 data={data} menuHidden={menuHidden}/>
      },
      {
        path: "Distribution",
        element: <Distribution data={data} menuHidden={menuHidden}/>
        }
    ]
    }
  ])

return (
    <RouterProvider router={router} >
    </RouterProvider>

  );

}


export default App;