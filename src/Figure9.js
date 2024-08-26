import "./Figure9.css"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { formatNumber } from "./utility"
import { colors } from "./color";

// 注册需要使用的 Chart.js 组件
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function statistic(data){  
    const dataBasinName={
        history: [],
        developed: []
    }
    // header + data
    const headers = data[0].map(item => item.value);
    const dataRows = data.slice(1);
    // index 
    const senarios = Array.from({length:12},(item,index)=>{ return (index + 1).toString()})
    senarios.push("M")
    const durations = ["30", "80"]
    const categories = ["all","history","developed"] // all + well count + main country (condition)
    // index
    const historyIndex = headers.indexOf("Well Count")
    const developedIndex = headers.indexOf("Majority Country")
    const developedCountry = ["Canada", "USA", "Norway", "UK", "Australia","Netherlands", "China", "Denmark", "Germany", "Japan"]
    // 计算每个categories下，每个年份下，每个senario下的求和
    const dataStatistic = {};
    durations.forEach((duration) =>{
        dataStatistic[duration]={}
        senarios.forEach((senario) =>{
            dataStatistic[duration][senario] = {}
            // get index -- use to sum 
            const storageIndex = headers.indexOf(senario + '_' + duration); 
            // inital
            categories.forEach((category) =>{
                dataStatistic[duration][senario][category] = 0
            })
            // update  -- now we have now which column we are gonna use. Now iterate the row
            dataRows.forEach((datarow) =>{
                // judge wheather the sum value is valid
                if (datarow[storageIndex] && datarow[storageIndex].value !== "NaN"){
                    // all
                    dataStatistic[duration][senario]["all"] += Number(datarow[storageIndex].value)
                    // history
                    if (datarow[historyIndex] && datarow[historyIndex].value >= 100)
                        dataStatistic[duration][senario]["history"] += Number(datarow[storageIndex].value)
                        
                    // developed
                    if (datarow[developedIndex] && developedCountry.includes(datarow[developedIndex].value))
                        dataStatistic[duration][senario]["developed"] += Number(datarow[storageIndex].value)
                }
            })
        })
    })
    return {dataStatistic, senarios, categories}
}



function prepareData(props){
    const labels = props.data.senarios
    const datasets = props.data.categories.map((category, index) =>{
        return {
        label: category,
        data: [],
        backgroundColor: colors[String(index * 2)],
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
function ChartComponentFigure9(props){
    // prepare date for chart
    const chartData = prepareData(props)
    // return
    const option = { 
        responsive: true,
        maintainAspectRatio: false,  // 防止保持原始宽高比
        scales: { 
            x: { 
                stacked: false,
                title: { // 标题
                    display: true,
                    text: 'Scenario',
                    font:{
                        size:20
                    }
                },
                ticks: {  //刻度标签
                    font: {
                        size: 18
                    }
                }

            },
            y: { 
                stacked: false,
                title: {  // 标题
                    display: true,
                    text: 'Storage Capacity (Gt)',
                    font:{
                        size:20
                    }        
                },
                ticks: {  //刻度标签
                    font: {
                        size: 18
                    }
                }

            }, 
        },
        plugins: {
            legend: {  // 图例
                labels: {
                    color: 'black', // 图例文字颜色
                    font: {
                        size: 20, // 图例文字大小
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

export function Figure9(props){    // props => data
    // judge
    if (!props.data.length) return <div></div>
    // statistic
    const statisticData = statistic(props.data)
    console.log(statisticData)
    return (
        <div className={`subpage ${props.menuHidden && "subpage-full"}`}>
            <div className="subpage-title">Figure9</div>
            <div className="subpage-intro">
                To explore the impact of governmental support and the readiness of countries for deployment on CCS, the bar chart below illustrates 13 scenarios. 
                <br/>In regions without a history of hydrocarbon exploration, the uncertainty of the subsurface geology is greater. This can lead to bottlenecks when developing new CCS projects. To illustrate this, CCS is only deployed in basins with more than 100 hydrocarbon wells. The figure below shows that limiting deployment to these basins does not significantly impact our storage resource estimates. On average, excluding basins without hydrocarbon experience, our storage resource estimate decreases by 17%.
                <br/>Another factor hindering CCS deployment is governmental support and the readiness of countries for deployment. The figure below demonstrates that the readiness of countries is the most limiting factor in our storage resource estimates.
            </div>
            <div className="duation-div">
                <h2>Duration = 30</h2>
                <h2>Duration = 80</h2>
            </div>
            <div className="data-map-box">
                <div>
                    <ChartComponentFigure9 data={statisticData} duration='30' />
                </div>
                <div>
                    <ChartComponentFigure9 data={statisticData} duration='80' />
                </div>
            </div>
        </div>
    )
}