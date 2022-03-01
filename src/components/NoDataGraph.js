import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import './style/Graph.css'
import { AiOutlineMinus } from 'react-icons/ai';
import { useEffect, useState } from 'react';

function NoDataGraph(props) {

    const color = 'rgb(160, 160, 160)'
    const backgroundColor = 'rgb(160, 160, 160, 0.17)'
    const [timeSelection, setTimeSelection] = useState("6M");

    let renderLabel = function() {
        return "entry.name";
    }
    
    return(
        <div className='graph' > 
            <h3 className='graph-header' style={{color: color}}>{props.label}</h3>
            <hr className='info-seperator'></hr>
            <div className='recent-data'>
                <h3 className='recent-data-main' style={{color: color}}>0.0 {props.unit}</h3>
                <p className='recent-data-percentage' style={{color: color, backgroundColor: backgroundColor, borderColor: color}}> 
                    <AiOutlineMinus className='arrow'/> 0.00%
                </p>
                <p className='recent-weight-change' style={{color: color}}>
                    {/* {(currentDataSet[currentDataSet.length - 1].oneRepMax - currentDataSet[0].oneRepMax) >= 0 ? "+" : ""}
                    {(Math.round(
                        ((currentDataSet[currentDataSet.length - 1].oneRepMax - currentDataSet[0].oneRepMax) + Number.EPSILON
                    ) * 100) / 100)} 
                    &nbsp;
                    {props.unit.toUpperCase()} */}
                    No Change
                </p>
            </div>
            <div className='recent-log'>
                <p>
                    Not enough data - create more logs  
                </p>
            </div>
            <div className='time-span no-data'>
                <div className='time-span-item' onClick={() => {setTimeSelection("1M")}}><span className={((timeSelection === "1M") ? 'active' : '')}>1M</span></div>
                <div className='time-span-item' onClick={() => {setTimeSelection("6M")}}><span className={((timeSelection === "6M") ? 'active' : '')}>6M</span></div>
                <div className='time-span-item' onClick={() => {setTimeSelection("YTD")}}><span className={((timeSelection === "YTD") ? 'active' : '')}>YTD</span></div>
                <div className='time-span-item' onClick={() => {setTimeSelection("1Y")}}><span className={((timeSelection === "1Y") ? 'active' : '')}>1Y</span></div>
                <div className='time-span-item' onClick={() => {setTimeSelection("5Y")}}><span className={((timeSelection === "5Y") ? 'active' : '')}>5Y</span></div>
                <div className='time-span-item' onClick={() => {setTimeSelection("MAX")}}><span className={((timeSelection === "MAX") ? 'active' : '')}>MAX</span></div>
            </div>
            
            <LineChart 
                className='chart' 
                width={((props.width < 550) ? props.width  : 550)} 
                height={props.height} 
                data={{}}
                label={renderLabel} 
            >
                <Line dataKey={props.dataKey} stroke={color} isAnimationActive={true} />
                <CartesianGrid stroke="#ccc" vertical={false} />
                <XAxis dataKey="date" domain={
                    [
                        props.dateFormatter((new Date()).setDate(new Date().getDate() - 20)), 
                        props.dateFormatter(new Date())
                    ]
                    }  tickCount={1} height={15}/>
                <YAxis domain={[0, 100]} tickCount={50} width={30}/>
            </LineChart>
        </div>
    )
}

export default NoDataGraph;