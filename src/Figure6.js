import "./Figure6.css"
import React, { useRef, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { formatNumber } from "./utility";
import {colors} from "./color.js"

// 注册需要使用的 Chart.js 组件
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// statistic => dataStatistic[duration][senario][region]
function statistic(data){
    // header + data
    const headers = data[0].map(item => item.value);
    const dataRows = data.slice(1);
    // index
    const senarios = Array.from({length:12},(item,index)=>{ return (index + 1).toString()})
    senarios.push("M")
    const durations = ["30", "80"]
    const regionIndex = headers.indexOf("Region")
    const countryIndex = headers.indexOf("Majority Country")
    // region statistic
    const regionSet = new Set();
    dataRows.forEach((item) =>{
        if (item[regionIndex]) regionSet.add(item[regionIndex].value)
    })
    const regions = Array.from(regionSet);
    // country statistic
    const country = {}
    dataRows.forEach((item) => {
        if (item[countryIndex] && item[regionIndex] && item[regionIndex].value && item[countryIndex].value)
        {
            if (country[item[regionIndex].value]) {
            if (!country[item[regionIndex].value].includes(item[countryIndex].value)) {
                country[item[regionIndex].value].push(item[countryIndex].value);
            }
            } 
            else {
            country[item[regionIndex].value] = [item[countryIndex].value];
            }
        }
      })
    // 计算每个region下，每个年份下，每个senario下的求和
    const dataStatistic = {};
    const dataStatisticCountry = {};
    durations.forEach((duration) =>{
        dataStatistic[duration]={}
        dataStatisticCountry[duration]={}
        senarios.forEach((senario) =>{
            dataStatistic[duration][senario] = {}
            dataStatisticCountry[duration][senario] = {}
            // get index 
            const storageIndex = headers.indexOf(senario + '_' + duration);
            // inital
            regions.forEach((region) =>{
                dataStatistic[duration][senario][region] = 0
                dataStatisticCountry[duration][senario][region]={}
            })
            // update
            dataRows.forEach((datarow) =>{
                if (datarow[regionIndex]){
                    if(datarow[storageIndex])
                        if (datarow[storageIndex].value !== "NaN") {
                            dataStatistic[duration][senario][datarow[regionIndex].value] += Number(datarow[storageIndex].value)
                            // country
                            if (dataStatisticCountry[duration][senario][datarow[regionIndex].value][datarow[countryIndex].value])
                                dataStatisticCountry[duration][senario][datarow[regionIndex].value][datarow[countryIndex].value] += Number(datarow[storageIndex].value)
                            else
                            dataStatisticCountry[duration][senario][datarow[regionIndex].value][datarow[countryIndex].value] = Number(datarow[storageIndex].value)
                        }
                }
            })
        })
    })
    // console.log("dataStatisticCountry",dataStatisticCountry)
    // console.log("Country:",country)
    return {dataStatistic, dataStatisticCountry, senarios, regions, country}
}

function prepareData(props){
    const labels = props.data.senarios
    const datasets = props.data.regions.map((region,index) =>{
        return {
        label: region,
        data: [],
        backgroundColor: colors[String(index)],
      }
    })

    labels.forEach(scenario => {
        datasets.forEach(dataset => {
          dataset.data.push(formatNumber(props.data.dataStatistic[props.duration][scenario][dataset.label]) || 0);
        });
      });

    return {
        labels: labels,
        datasets: datasets
    }
}

// chart component
function ChartComponent(props){
    // prepare date for chart
    const chartData = prepareData(props)
    // return
    const option = { 
        responsive: true,
        maintainAspectRatio: false,  // 防止保持原始宽高比
        scales: { 
            x: { 
                stacked: true,
                title: {
                    display: true,
                    text: 'Scenario',
                    font: {
                        size: 20, // 图例文字大小
                    },
                  },
                ticks:{
                    font: {
                        size: 18, // 图例文字大小
                    },
                } 

            },
            y: { 
                stacked: true,
                title: {
                    display: true,
                    text: 'Storage capacity (Gt)',
                    font: {
                        size: 18, // 图例文字大小
                    },
                  },
                ticks:{
                    font: {
                        size: 18, // 图例文字大小
                    },
                }                  
            },
        },
        plugins: {
            legend: {  // 图例
                labels: {
                    color: 'black', // 图例文字颜色
                    font: {
                        size: 15, // 图例文字大小
                    }
                },
                // click event  
                // onClick: (e, legendItem, legend) => { 
                //     const index = legendItem.datasetIndex;  // get the index of dataset (which is also the index of states)
                //     // change the state
                //     props.setLegendStates((preValue) =>{
                //         let preValueCopy = preValue
                //         preValueCopy[index] = !preValueCopy[index]
                //         return preValueCopy
                //     })
                // }

            }
        }, 
    }

    const style = {
        width: "40vw",
        height: "75vh"
    }

    // // click event update map states
    // chartData.datasets.forEach((dataset,index) => {
    //     dataset.hidden = props.legendStates[index] === false;
    // });

    return <Bar className="data-map" style={style} data={chartData} options={option} />;

}

// filter
function FilterScenario(props){
    function optionArray(){
        const senarios = Array.from({length:12},(item,index)=>{ return (index + 1).toString()})
        senarios.push("M")
        const optionArray = senarios.map((scenario) =>{
            return <option value={scenario}>{scenario}</option>
        })
        return optionArray
    }
    return (
        <div className="filter-input">
            <div className="filter-input-name">Scenario:</div>
            <select className="filter-input-selector" onChange={(event) =>{props.setFilterScenario(event.target.value)}}>
                {optionArray()}
            </select>
        </div>
    )
}

// filter
function FilterRegion(props){
    function optionArray(){
        const optionArray = props.regions.map((scenario) =>{
            return <option value={scenario}>{scenario}</option>
        })
        return optionArray
    }
    return (
        <div className="filter-input">
            <div className="filter-input-name">Regions:</div>
            <select className="filter-input-selector" onChange={(event) =>{props.setFilterRegion(event.target.value)}} value={props.filterRegion}>
                {optionArray()}
            </select>
        </div>
    )
}

function preparePieDataSenario(props){
    const labels = props.data.regions
    const datasets = [{
        data: labels.map((region) =>{
            return formatNumber(props.data.dataStatistic[props.duration][props.filterScenario][region])
        }) ,
        backgroundColor: labels.map((region, index) => {
            return colors[String(index)]
        }),
      }]

    return {
        labels: labels,
        datasets: datasets
    }
}

function preparePieDataCountry(props){
    const labels = props.data.country[props.filterRegion]
    const datasets = [{
        data: labels.map((country) =>{
            return formatNumber(props.data.dataStatisticCountry[props.duration][props.filterScenario][props.filterRegion][country])
        }) ,
        backgroundColor: labels.map((country, index) => {
            return colors[String(index)]
        }),
      }]

    return {
        labels: labels,
        datasets: datasets
    }
}

// pie
function PieComponent(props){
    // prepare date for chart
    let chartData = null
    if (props.type === "scenario")
        chartData = preparePieDataSenario(props)
    else 
        chartData = preparePieDataCountry(props)
    console.log("PiePreapareData:",chartData)
    // return
    const option = { 
        responsive: true,  // 图表自动缩放
        plugins: {
        legend: {
            position: 'top', // 图例位置
            labels: {
                color: 'black', // 图例文字颜色
                font: {
                    size: 15, // 图例文字大小
                },
            }
        },
        tooltip: {
            mode: 'index',
            intersect: false, // 鼠标悬停显示提示
        }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }

    const style = {
        width: "30vw",
        height: "50vh"
    }

    return <Pie className="data-map" style={style} data={chartData} options={option} />;
}

export function Figure6(props){
    // filter state
    const [filterScenario, setFilterScenario] = useState(1)
    const [filterRegion30, setFilterRegion30] = useState("Asia")
    const [filterRegion80, setFilterRegion80] = useState("Asia")
    console.log(filterScenario)
    // legend show states (to associate two legend)
    const [legendStates, setLegendStates] = useState(new Array(9).fill(true))
    console.log(legendStates)
    // judge
    if (!props.data.length) return <div></div>
    // statistic
    const statisticData = statistic(props.data)
    console.log("statistic:",statisticData)
    // chart
    return(
        <div className={`subpage ${props.menuHidden && "subpage-full"}`}>
            <div className="subpage-title">Figure6</div>
            <div className="subpage-intro">Analyzing the contribution of different regions to CCS resources plays a crucial role from a global perspective. The figure below uses stacked bar charts to depict the storage capacity of different regions after 30 and 80 years under 12 scenarios and the M scenario. <br/>Clicking on the legend allows for the specific region to be toggled off.</div>
            <div className="duation-div">
                    <h2>Duration = 30</h2>
                    <h2>Duration = 80</h2>
            </div>
            <div className="data-map-box">
                <div>
                    <ChartComponent data={statisticData} duration='30' legendStates={legendStates} setLegendStates={setLegendStates}/>
                </div>
                <div>
                    <ChartComponent data={statisticData} duration='80' legendStates={legendStates} setLegendStates={setLegendStates}/>
                </div>
            </div>
            <img src="divider_icon.png" className="divider"/>
            <div className="subpage-intro">Analyzing the contribution of different regions to CCS resources is crucial from a global perspective. To more clearly compare which regions contribute the most and the least to capacity in each scenario, pie charts for different scenarios after 30 and 80 years are drawn below. A selection box allows for choosing a specific scenario to generate the pie charts. Clicking on the legend enables the display of specific regions to be toggled off.</div>
            <div className="data-pie-box">
                <FilterScenario setFilterScenario={setFilterScenario} filterScenario={filterScenario} />
                <div className="duation-div">
                    <h2>Duration = 30</h2>
                    <h2>Duration = 80</h2>
                </div>
                <div className="pies">
                    <div>
                        <PieComponent type={"scenario"} data={statisticData} duration='30' filterScenario={filterScenario}/>
                    </div>
                    <div>
                        <PieComponent type={"scenario"} data={statisticData} duration='80' filterScenario={filterScenario}/>
                    </div>
                </div>
            </div>
            <div className="data-pie-box">
                <div className="die-pie-filter-box">
                    <FilterRegion setFilterRegion={setFilterRegion30} filterRegion={filterRegion30} regions={statisticData.regions}/>
                    <FilterRegion setFilterRegion={setFilterRegion80} filterRegion={filterRegion80} regions={statisticData.regions} />
                </div>
                <div className="pies">
                    <div>
                        <PieComponent type={"region"} data={statisticData} duration='30' filterScenario={filterScenario} filterRegion={filterRegion30}/>
                    </div>
                    <div>
                        <PieComponent type={"region"} data={statisticData} duration='80' filterScenario={filterScenario} filterRegion={filterRegion80}/>
                    </div>
                </div>
            </div>
        </div>
    )
}