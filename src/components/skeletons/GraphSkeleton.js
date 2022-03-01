import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import '../style/Graph.css'

function GraphSkeleton(props) {
  return (
    <div className='graph-item'>
        <div className='graph' > 
            <div className='graph-header'>
                <Skeleton variant='rectangular' width={125} height={24} style={{borderRadius: '8px', margin: '10px 10px 10px 0px'}} />
            </div>
            <hr className='info-seperator'></hr>
            <div className='recent-data'>
                <h3 className='recent-data-main'>
                    <Skeleton variant='rectangular' width={245} height={35} style={{borderRadius: '8px', margin: '5px 10px 5px 0px'}} />
                </h3>
            </div>
            <div className='recent-log'>
                <p>
                <Skeleton variant='rectangular' width={200} height={10} style={{borderRadius: '8px', margin: '3px 10px 5px 0px'}} />
                </p>
            </div>
            <div className='time-span no-data' style={{ paddingLeft: '30px', paddingTop: '0px', paddingBottom: '0px'}}>
                <Skeleton variant='rectangular' width={275} height={25} style={{borderRadius: '8px', margin: '0px 10px 10px 0px'}} />
            </div>
            
            <Skeleton variant="rectangular" width={props.width} height={props.height} style={{maxWidth: '550px', margin: 'auto', borderRadius: '8px', marginBottom: '19px'}} />
        </div>
    </div>
  );
}

export default GraphSkeleton;