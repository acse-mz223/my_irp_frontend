import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "./Distribution.css"
import L, { map } from 'leaflet';
import omnivore from 'leaflet-omnivore';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ReactComponent as DeleteButton } from './delete_icon.svg';
import { formatNumber } from "./utility"


// process data to GeoJSON data (GeometryCollection to FeatureCollection)
function prepareDataFun(data){
    // judge
    if (data === null) return null
    const preparedData = {
        type: 'FeatureCollection',
        features:[]
    }
    data.geometries.forEach((item,index) =>{
        preparedData.features.push(
            {
                type: "Feature",
                properties: {
                name: index
                },
                geometry: item
            }
        )
    })
    console.log("pre",preparedData)
    return preparedData
}

// get the basin name of different class
export function statistic(data){ 
    // dataBasinName
    const dataBasinName={
        "history": [],
        "developed": []
    }
    // header + data
    const headers = data[0].map(item => item.value);
    const dataRows = data.slice(1);
    // index
    const bainNameIndex = headers.indexOf("Basin Name")
    const historyIndex = headers.indexOf("Well Count")
    const developedIndex = headers.indexOf("Majority Country")
    const developedCountry = ["Canada", "USA", "Norway", "UK", "Australia","Netherlands", "China", "Denmark", "Germany", "Japan"]

    // 
    dataRows.forEach((datarow) =>{
        // history
        if (datarow[historyIndex] && datarow[historyIndex].value >= 100)
            dataBasinName["history"].push(datarow[bainNameIndex].value)
            
        // developed
        if (datarow[developedIndex] && developedCountry.includes(datarow[developedIndex].value))
            dataBasinName["developed"].push(datarow[bainNameIndex].value)
    })

    return dataBasinName
}



export function KMLLayer(props) {
    const map = useMap();

    useEffect(() => {
        const kmlLayer = omnivore.kml('/Global_Basins.kml');
        console.log("kml layer")
        console.log("KML Data:", kmlLayer.toGeoJSON());
        kmlLayer.on('ready', () => {
            kmlLayer.eachLayer((layer) => {
                // 查看pane
                console.log("pane:",layer.options.pane)
                layer.bringToBack()
                // 设置图层样式
                let color;
                if (layer.feature && layer.feature.properties){
                    // set color
                    const basinName = layer.feature.properties['Basin Name'];
                    if (props.dataBasinName['developed'].includes(basinName) && props.dataBasinName['history'].includes(basinName)) {
                        color = 'red';
                    } else if (props.dataBasinName['developed'].includes(basinName)) {
                        color = 'green';

                    } else if (props.dataBasinName['history'].includes(basinName)) {
                        color = 'blue';
                    } else {
                        color = 'grey'; // 默认颜色
                    }
                    layer.setStyle({
                        color: color, // 边界颜色
                        weight: 1,        // 边界宽度
                        opacity: 0.65     // 边界透明度
                    });
                }

                // 添加点击事件
                layer.on('click', (e) => {
                    // console
                    console.log("layer click!!")
                    // 弹窗显示属性信息
                    if (layer.feature && layer.feature.properties) {
                        const layerProps = layer.feature.properties;
                        let popupContent = '<div class="popup-content">';
                        popupContent += `<h3>${layerProps['Basin Name']}</h3>`;
                        popupContent += `<p><strong>Basin Type:</strong> ${layerProps['Basin Type']}</p>`;
                        popupContent += `<p><strong>Region:</strong> ${layerProps['Region']}</p>`;
                        popupContent += `<p><strong>Longitude:</strong> ${layerProps['Longitude']}</p>`;
                        popupContent += `<p><strong>Latitude:</strong> ${layerProps['Latitude']}</p>`;
                        popupContent += '</div>';


                        L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map)
                    }
                });
                
                // hover event
                layer.on("mouseover", (e) =>{
                    layer.setStyle({
                        color: color, // 边界颜色
                        weight: 3,        // 边界宽度
                        opacity: 0.65     // 边界透明度
                    });
                })
                layer.on("mouseout", (e) =>{
                    layer.setStyle({
                        color: color, // 边界颜色
                        weight: 1,        // 边界宽度
                        opacity: 0.65     // 边界透明度
                    });
                })

                // double click event
                layer.on("dblclick", ()=>{
                    if (layer.feature && layer.feature.properties) {
                        const LayerProps = layer.feature.properties;
                        props.popupMoreFunc(LayerProps['Basin Name'])
                    }
                })

            });
            

        });
        kmlLayer.addTo(map);

        return () => {
            map.removeLayer(kmlLayer);
        };

    }, [map]);

    return null;
}

function MapLegend(props){
    console.log("myMapRef:",props.myMapRef)
    function onHoverLabel(type,dataBasinName,myMapRef){
        myMapRef.current.eachLayer((layer) =>{
            if (layer.feature && layer.feature.properties){
                // set color
                let color,weight;
                const basinName = layer.feature.properties['Basin Name'];
                if (dataBasinName['developed'].includes(basinName) && props.dataBasinName['history'].includes(basinName)) {
                    color = 'red';
                    type === "both"? weight=3:weight=1; 
                } else if (dataBasinName['developed'].includes(basinName)) {
                    color = 'green';
                    type === "developed"? weight=3:weight=1; 
                } else if (dataBasinName['history'].includes(basinName)) {
                    color = 'blue';
                    type === "history"? weight=3:weight=1; 
                } else {
                    color = 'grey'; // 默认颜色
                    type === "none"? weight=3:weight=1; 
                }
                layer.setStyle({
                    color: color, // 边界颜色
                    weight: weight,        // 边界宽度
                    opacity: 0.65     // 边界透明度
                });
            }
        })
    }

    return (
        <ul className='legend-box'>
            <div className="legend-box-div" onMouseOver={()=>{onHoverLabel("history",props.dataBasinName,props.myMapRef)}} onMouseOut={()=>{onHoverLabel("null",props.dataBasinName,props.myMapRef)}}>
                <div className='mark mark1'></div>
                <label className='legend'>History</label>
            </div>
            <div className="legend-box-div" onMouseOver={()=>{onHoverLabel("developed",props.dataBasinName,props.myMapRef)}} onMouseOut={()=>{onHoverLabel("null",props.dataBasinName,props.myMapRef)}}>
                <div className='mark mark2' ></div>
                <label className='legend' >Developed</label>
            </div>
            <div className="legend-box-div" onMouseOver={()=>{onHoverLabel("both",props.dataBasinName,props.myMapRef)}} onMouseOut={()=>{onHoverLabel("null",props.dataBasinName,props.myMapRef)}}>
                <div className='mark mark3' ></div>
                <label className='legend' >Both</label>
            </div>
            <div className="legend-box-div" onMouseOver={()=>{onHoverLabel("none",props.dataBasinName,props.myMapRef)}} onMouseOut={()=>{onHoverLabel("null",props.dataBasinName,props.myMapRef)}}>
                <div className='mark mark4' ></div>
                <label className='legend' >None</label>
            </div>
        </ul>
    )
}

function getBasinInfor(data,basinName){
    // data
    const headers = data[0].map(item => item.value);
    const dataRows = data.slice(1);
    let basinInfor = {}
    // index
    const nameIndex = headers.indexOf("Basin Name")
    for (let i=0; i < dataRows.length; i++){
        if (basinName === dataRows[i][nameIndex].value){
            // basinInfor
            headers.forEach(((property) =>{
                const index = headers.indexOf(property)
                basinInfor[property] = dataRows[i][index]? dataRows[i][index].value : ""
            }))

            break
        }
    }
    return basinInfor
}

function BasicInforBoard({basinInfor}){
    console.log('basinInfor:',basinInfor)
    const inforHeader=["Basin Name","Basin Size Label","Majority Country","Attributing Countries","Region","Location Longitude","Location Latitude","QGIS Poly Area (km^2)","Well Count"]
    return (
        <div className='basic-infor-board'>
            <table>
                <thead>
                    <tr>
                        <th>Basic info</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {inforHeader.map((property) =>{
                        return(
                            <tr>
                                <td>{property}</td>
                                <td>{basinInfor[property]}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )

}

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);
function CampacityInforBoard({basinInfor}){
  const senarios = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "M"]
  // data
  const data = {
    labels: senarios,
    datasets: [
      {
        label: 'Duration = 30',
        data: senarios.map((senario) =>{
            return formatNumber(basinInfor[senario+"_30"])
        }), 
        borderColor: '#3e95cd',
        backgroundColor: '#7bb6dd',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Duration = 80',
        data: senarios.map((senario) =>{
            return formatNumber(basinInfor[senario+"_80"])
        }), 
        borderColor: '#8e5ea2',
        backgroundColor: '#c78ecf',
        fill: false,
        tension: 0.1
      }
    ]
  };

  // set
  const options = {
    plugins: {
      legend: {
        position: 'top' 
      },
      tooltip: {
        mode: 'index',
        intersect: true, 
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Scenario'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Capacity'
        }
      }
    },
    responsive: true, 
    maintainAspectRatio: false 
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
}


export function Distribution(props){
    // state
    const [geoData, setGeoData] = useState(null);

    // fetch data
    useEffect(() => {
      fetch('./Global_Basins.json')
        .then(response => response.json())
        .then(data => prepareDataFun(data))
        .then(data => setGeoData(data));
    }, []);
    console.log("geo", geoData)

    // style
    const style={
        color: 'blue',
        weight: 1,
        fillColor: 'blue',
        fillOpacity: 0.5
    }

    // calculate the boundary of map -- 定义地图的最大边界
    const corner1 = L.latLng(90, -180);
    const corner2 = L.latLng(-90, 180);
    const bounds = L.latLngBounds(corner1, corner2);

    // ref + initalmap
    const myMapRef = useRef(null)
    useEffect(() =>{
        if (myMapRef.current){
            myMapRef.current.invalidateSize();  // info map to redraw 
        }
    },[props.menuHidden])

    // map layer
    // get developed + history name
    let dataBasinName
    if (props.data.length){
        dataBasinName = statistic(props.data);
        console.log("dataBasinName:", dataBasinName)
    }

    // local board info get
    const localInfo = JSON.parse(localStorage.getItem("distributionBoardInfo")) || []
    const boardInit = localInfo.map((info) =>{
        return (
            <div className='one-board' key={info.basinName.replace(/\s+/g, '')}>
                <DeleteButton className="delete-button" onClick={() =>{deleteOneBoard(info.basinName.replace(/\s+/g, ''))}}/>
                <div className="one-board-title">{info.basinName}</div>
                <BasicInforBoard basinInfor={info.basinInfor}/>
                <CampacityInforBoard basinInfor={info.basinInfor}/>
            </div>
        ) 
    })

    // add infor the board
    const [board, setBoard] = useState(boardInit)
    const boardlist = []
    function deleteOneBoard(key){
        // get localstorage
        const localStorageDel = JSON.parse(localStorage.getItem("distributionBoardInfo"))
        // update boardlist
        const index = boardlist.indexOf(key)
        boardlist.splice(index,1)
        // update board
        setBoard((preValue)=>{
            return preValue.filter((item) =>{
                if (item.key !== key) return true
            })
        })
        // update localstorage
        localStorage.setItem("distributionBoardInfo",JSON.stringify(localStorageDel.filter((item) =>{
            if (item.key !== key) return true
        })))



    }

    function popupMoreFunc(basinName){
        // update localstorage
        const localStorageAdd = JSON.parse(localStorage.getItem("distributionBoardInfo")) || []
        // check weather this basin is in board or not
        let Inboard = false
        boardlist.forEach((item) =>{
            if (item === basinName.replace(/\s+/g, '')){
                Inboard = true
                alert("The basin has already in board")
            }
        })
        if (!Inboard){
            // add key in to boardlist
            boardlist.push(basinName.replace(/\s+/g, ''))
            console.log("boardlist:",boardlist)
            // get info 
            const basinInfor = getBasinInfor(props.data, basinName)
            //infor board
            const oneBoard = (
                <div className='one-board' key={basinName.replace(/\s+/g, '')}>
                    <DeleteButton className="delete-button" onClick={() =>{deleteOneBoard(basinName.replace(/\s+/g, ''))}}/>
                    <div className="one-board-title">{basinName}</div>
                    <BasicInforBoard basinInfor={basinInfor}/>
                    <CampacityInforBoard basinInfor={basinInfor}/>
                </div>
            ) 
            // board
            setBoard((preValue) =>{
                return [
                    ...preValue,
                    oneBoard
                ]
            })
            // update localstorage
            localStorageAdd.push({
                key: basinName.replace(/\s+/g, ''),
                basinName,
                basinInfor
            })
        }
        console.log("ad:", localStorageAdd)
        // update localstorage
        localStorage.setItem("distributionBoardInfo", JSON.stringify(localStorageAdd))


    }
    
    if (!props.data.length) return <div></div>
    return (
        <div className={`subpage ${props.menuHidden && "subpage-full"}` }>
            <div className="subpage-title">Data distribution map</div>
            <div className="subpage-intro"> One of the factors influencing CCS deployment is governmental support and the readiness of countries for deployment. The Global CCS Institute categorizes countries using the Storage Readiness Index. A high index rating reflects progressive policies or legal support for CCS projects and a reliance on fossil fuels. The storage readiness index identifies Canada, the USA, Norway, the UK, and Australia as the countries best prepared for advancing CCS deployment (Band A countries). Additionally, five countries (The Netherlands, China, Denmark, Germany, and Japan) are considered Band B countries. In the diagram, the basins in these countries are marked in green. Furthermore, any basin with more than 100 hydrocarbon wells is defined as regions with historic hydrocarbon exploration, which are marked in blue in the diagram. Basins that meet both criteria are marked in red, otherwise they are marked in gray.<br/>Double-clicking on a basin will provide detailed data about that basin.</div>
            <div className='distribution'>
                <MapContainer center={[51.5074, -0.127758]} 
                ref={myMapRef}
                zoom={5} 
                style={{ height: '100%', width: '100%' }}
                maxBounds={bounds} 
                minZoom={2.2}
                maxBoundsViscosity={1.0}
                doubleClickZoom={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* {geoData && <GeoJSON data={geoData} style={style}/>} */}
                    <KMLLayer  dataBasinName={dataBasinName} popupMoreFunc={popupMoreFunc}/>
                </MapContainer>
                <MapLegend  dataBasinName={dataBasinName} myMapRef={myMapRef}/>
                <div className='board'>
                    {board}
                </div>
            </div>
        </div>
      );
}