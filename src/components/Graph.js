import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import './style/Graph.css'
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { add, format, differenceInCalendarDays, isFuture } from "date-fns";
import { jsonEval } from '@firebase/util';

function CustomLabel({ x, y, stroke, value, width }) {
    if(value) {
      // No label if there is a value. Let the cell handle it.
      return null;
    }
  
     return (
      <text 
        x={x}
        y={y}
        // Move slightly above axis
        dy={-10}
        // Center text
        dx={width/2}
        fill={stroke}
        fontSize={15}
        textAnchor="middle"
      >
          N/A
      </text>
    )
  }

function Graph(props) {
    const [timeSelection, setTimeSelection] = useState("6M");
    const [currentDataSet, setCurrentDataSet] = useState(props.data)

    let tooltip;
    const CustomTooltip = ({ active, payload }) => {
        if (!active || !tooltip)    return null
        for (const bar of payload)
        if (bar.dataKey === tooltip) {
                return (
                    <div className='custom-tooltip'>
                        { bar.value.toFixed(2) } LBS <span className='tooltip-date'>{dateFormatter(bar.payload.date)}</span>
                    </div>
                )
            }
        return null
    }

    function differenceInDays(date1, date2) {
        var timeDiff = date2.getTime() - date1.getTime();
        var daysDiff = timeDiff / (1000 * 3600 * 24);
        return(daysDiff)
    }

    function cutDataAtTimeSelection(selectedTime) {
        let today = new Date()
        let diffInDays = 0;

        if (selectedTime === "1M") {
            diffInDays = 30
        } else if (selectedTime === "6M") {
            diffInDays = 180
        } else if (selectedTime === "YTD") {
            let startOfYear = new Date(new Date().getFullYear(), 0, 1);
            diffInDays = differenceInCalendarDays(today, startOfYear)
        } else if (selectedTime === "1Y") {
            diffInDays = 365
        } else if (selectedTime === "5Y") {
            diffInDays = 1825
        } else if (selectedTime === "MAX") {
            return props.data
        }

        for(let i = props.data.length - 1; i >= 0;  i--) {
            if(differenceInCalendarDays(today, props.data[i].date) > diffInDays) {
                if(i !== (props.data.length - 1)) {
                    return props.data.slice(i  + 1)
                }
            }
        }

        return props.data
    }
    
    const dateFormatter = date => {
        return format(new Date(date), "MMM dd");
    };

    useEffect(() => {
        console.log(timeSelection)
        console.log("timeSelection")
        setCurrentDataSet(cutDataAtTimeSelection(timeSelection))
    }, [timeSelection]);

    useEffect(() => {
        console.log(currentDataSet)
    }, [currentDataSet]);

    useEffect(() => { 
        console.log("props")
        setCurrentDataSet(cutDataAtTimeSelection(timeSelection))
    }, [props.data]);

    return (
        <div className="graph-item">
            <div className='graph' > 
                <h3 className='graph-header'>{props.label}</h3>
                <hr className='info-seperator'></hr>
                <div className='recent-data'>
                    <h3 className='recent-data-main'>{currentDataSet[currentDataSet.length - 1][props.dataKey].toFixed(1)} {props.unit}</h3>
                    <p className='recent-data-percentage'> 
                    {
                        (currentDataSet[currentDataSet.length - 1].oneRepMax / currentDataSet[0].oneRepMax) > 0 
                        ? 
                        <AiOutlineArrowUp className='arrow'/> 
                        : 
                        <AiOutlineArrowDown className='arrow'/>
                    }
                    {
                    // (Math.round(
                    //     ( + Number.EPSILON
                    // ) * 10000) / 10000).toFixed(2) + "%"

                    ((Math.round( ((currentDataSet[currentDataSet.length - 1].oneRepMax / currentDataSet[0].oneRepMax) - 1) * 10000 ) / 10000) * 100).toFixed(2) + "%"
                    } 
                    </p>
                    <p className='recent-weight-change'>
                        {(currentDataSet[currentDataSet.length - 1].oneRepMax - currentDataSet[0].oneRepMax) > 0 ? "+" : ""}
                        {(Math.round(
                            ((currentDataSet[currentDataSet.length - 1].oneRepMax - currentDataSet[0].oneRepMax) + Number.EPSILON
                        ) * 100) / 100)} 
                        &nbsp;
                        {props.unit.toUpperCase()}
                    </p>
                </div>
                <div className='recent-log'>
                    <p>
                        {/* Feb 4, 10:57:51 AM UTC-5 - ESTIMATED 1RM - 160 lbs x 9  */}
                        {String(currentDataSet[currentDataSet.length - 1].date).slice(0, 15)}&nbsp;
                        - ESTIMATED 1RM - 
                        &nbsp;{currentDataSet[currentDataSet.length - 1].weight}&nbsp;
                        x 
                        &nbsp;{currentDataSet[currentDataSet.length - 1].reps}&nbsp;
                        =
                        &#8197;{currentDataSet[currentDataSet.length - 1].oneRepMax}
                        </p>
                </div>
                <div className='time-span'>
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
                    onMouseOver={() => tooltip = props.dataKey}
                    onMouseDown={() => tooltip = props.dataKey}
                    data={currentDataSet}
                >
                    <Line dataKey={props.dataKey} stroke="#2E834A" isAnimationActive={true} />
                    <CartesianGrid stroke="#ccc" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={dateFormatter} height={15}/>
                    <YAxis domain={[dataMin => (Math.round(dataMin) - 10), dataMax => (Math.round(dataMax) + 10)]} tickCount={50} width={30}/>
                    <Tooltip 
                        position={{y:30}}
                        wrapperStyle={{visibility: 'visible'}}
                        content={<CustomTooltip/>}
                    />
                </LineChart>
            </div>
        </div>
        
    );
}

export default Graph;
