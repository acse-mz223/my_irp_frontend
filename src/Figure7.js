import "./Figure7.css"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { formatNumber } from "./utility"
import { colors } from "./color";

// 注册需要使用的 Chart.js 组件
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function statistic(data){  //each cell is stored as {value: cell}
    // header + data
    const headers = data[0].map(item => item.value);
    const dataRows = data.slice(1);
    // index
    const senarios = Array.from({length:12},(item,index)=>{ return (index + 1).toString()})
    senarios.push("M")
    const durations = ["30", "80"]
    const limitations = ["P","T"]
    // 计算每个limit下，每个年份下，每个senario下的求和
    const dataStatistic = {};
    durations.forEach((duration) =>{
        dataStatistic[duration]={}
        senarios.forEach((senario) =>{
            dataStatistic[duration][senario] = {}
            // get index 
            const storageIndex = headers.indexOf(senario + '_' + duration);
            // inital
            limitations.forEach((limitation) =>{
                dataStatistic[duration][senario][limitation] = 0
            })
            // update  -- now we have now which column we are gonna use. Now iterate the row
            dataRows.forEach((datarow) =>{
                //  && datarow[storageIndex+1].value === ("P" || "T")
                if (datarow[storageIndex+1] && (datarow[storageIndex+1].value === "P" || datarow[storageIndex+1].value === "T")){ // if limitation is valid
                    { if (datarow[storageIndex+1].value === 0) console.log(storageIndex)
                    if(datarow[storageIndex] && datarow[storageIndex].value !== "NaN")  // if storage is valid
                        dataStatistic[duration][senario][datarow[storageIndex+1].value] += datarow[storageIndex].value
                      }  
                }
            })
            // culculate the percent
            const total = dataStatistic[duration][senario]["T"] + dataStatistic[duration][senario]["P"] 
            dataStatistic[duration][senario]["T"] = dataStatistic[duration][senario]["T"]/total
            dataStatistic[duration][senario]["P"] = dataStatistic[duration][senario]["P"]/total  
        })
    })
    return {dataStatistic, senarios, limitations}
}

function prepareData(props){
    // senarios array
    const labels = props.data.senarios
    // datasets = 2 * dataset =  dataset in T + dataset in P
    const datasets = props.data.limitations.map((limitation, index) =>{
        return {
        label: limitation,
        data: [],
        backgroundColor: colors[String(index * 8)],
      }
    })

    // data
    labels.forEach(scenario => {
        datasets.forEach(dataset => {
          // push in the data for differnet senarios in T and P
          dataset.data.push(formatNumber(props.data.dataStatistic[props.duration][scenario][dataset.label]) || 0);
        });
      });
    
    // updata the name of dataset.label 
    datasets.forEach((dataset) =>{
        if (dataset.label === "T") dataset.label = "Limited by number of injection sites"
        if (dataset.label === "P") dataset.label = "Limited by pressure"
    })
    
    return {
        labels: labels,
        datasets: datasets
    }
}

// chart component
function ChartComponentFigure7(props){
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
                    font:{
                        size:20
                    }
                },
                ticks:{
                    font:{
                        size:18
                    }                    
                }
            },
            y: { 
                stacked: true,
                title: {
                    display: true,
                    text: 'Percentage of Storage resource (%)',
                    font:{
                        size:20
                    }
                  },
                max: 1, // 最大刻度
                min: 0,  // 最小刻度
                ticks: {
                    stepSize: 0.2, // 刻度间隔
                    font:{
                        size:18
                    }
                }, 
            },
        },
        plugins: {
            legend: {  // 图例
                labels: {
                    color: 'black', // 图例文字颜色
                    font: {
                        size: 18, // 图例文字大小
                    },
                }
            }
        }, 
    }

    const style = {
        width: "40vw",
        height: "85vh"
    }

    return <Bar className="data-map" style={style} data={chartData} options={option} />;

}

export function Figure7(props){    // props => data
    // judge
    if (!props.data.length) return <div></div>
    // statistic
    const statisticData = statistic(props.data)
    return (
        <div className={`subpage ${props.menuHidden && "subpage-full"}`}>
            <div className="subpage-title">Figure7</div>
            <div className="subpage-intro">The storage capacity of different basins may be limited by the pressure constraints due to their thinner or less permeable reservoirs or by the number of injection sites. To explore the pattern of limiting factors for each scenario, the chart below depicts the percentage of storage resource impacted by these two limitations after 30 and 80 years for different scenarios.<br/> Clicking on the legend allows for the display of specific limitations to be toggled off.<br/> It can be observed that pressure limitations systematically increase as expected with decreased site spacing and an increased number of sites. Additionally, pressure limitations are a pervasive feature of large-scale CCS deployment.</div>
            <div className="duation-div">
                <h2>Duration = 30</h2>
                <h2>Duration = 80</h2>
            </div>
            <div className="data-map-box">
                <div>
                    <ChartComponentFigure7 data={statisticData} duration='30' />
                </div>
                <div>
                    <ChartComponentFigure7 data={statisticData} duration='80' />
                </div>
            </div>
        </div>
    )
}