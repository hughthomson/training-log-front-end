import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import './style/Graph.css'
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { format, differenceInCalendarDays } from "date-fns";
import NoDataGraph from './NoDataGraph';

function Graph(props) {
    const [timeSelection, setTimeSelection] = useState("6M");
    const [currentDataSet, setCurrentDataSet] = useState(props.data)
    const [color, setColor] = useState('#2E834A')
    const [backgroundColor, setBackgroundColor] = useState('rgb(46, 131, 74, 0.17)')

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
        if(props.data != null) {
            setCurrentDataSet(cutDataAtTimeSelection(timeSelection))
        }
    }, [timeSelection]);

    useEffect(() => {
        if(props.data != null) {
            if(currentDataSet[currentDataSet.length - 1].oneRepMax - currentDataSet[0].oneRepMax >= 0) {
                setColor('#2E834A')
                setBackgroundColor('rgb(46, 131, 74, 0.17)')
            } else {
                setColor('#E03616')
                setBackgroundColor('rgb(224, 54, 22, 0.17)')
            }
        }
    }, [currentDataSet]);

    useEffect(() => { 
        if(props.data != null) {
            setCurrentDataSet(cutDataAtTimeSelection(timeSelection))
        }
    }, [props.data]);

    return (
        <div className="graph-item">
            {
                (props.data === null)
                ?
                <NoDataGraph label={props.label} width={props.width} height={props.height} unit={props.unit} dataKey={"oneRepMax"} dateFormatter={dateFormatter} />
                :
                <div className='graph' > 
                    <h3 className='graph-header'>{props.label}</h3>
                    <hr className='info-seperator'></hr>
                    <div className='recent-data'>
                        <h3 className='recent-data-main'>{currentDataSet[currentDataSet.length - 1][props.dataKey].toFixed(1)} {props.unit}</h3>
                        <p className='recent-data-percentage' style={{color: color, backgroundColor: backgroundColor, borderColor: color}}> 
                        {
                            (currentDataSet[currentDataSet.length - 1].oneRepMax - currentDataSet[0].oneRepMax) > 0 
                            ? 
                            <AiOutlineArrowUp className='arrow'/> 
                            : 
                            <AiOutlineArrowDown className='arrow'/>
                        }
                        {
                        ((Math.round( ((currentDataSet[currentDataSet.length - 1].oneRepMax / currentDataSet[0].oneRepMax) - 1) * 10000 ) / 10000) * 100) >= 0
                        ?
                        ((Math.round( ((currentDataSet[currentDataSet.length - 1].oneRepMax / currentDataSet[0].oneRepMax) - 1) * 10000 ) / 10000) * 100).toFixed(2) + "%"
                        :
                        ((Math.round( ((currentDataSet[currentDataSet.length - 1].oneRepMax / currentDataSet[0].oneRepMax) - 1) * 10000 ) / 10000) * -100).toFixed(2) + "%"
                        } 
                        </p>
                        <p className='recent-weight-change' style={{color: color}}>
                            {(currentDataSet[currentDataSet.length - 1].oneRepMax - currentDataSet[0].oneRepMax) >= 0 ? "+" : ""}
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
                        <Line dataKey={props.dataKey} stroke={color} isAnimationActive={true} />
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
            }
        </div>
        
    );
}

export default Graph;
