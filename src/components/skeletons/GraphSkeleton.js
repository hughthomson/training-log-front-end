import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import '../style/Graph.css'

function GraphSkeleton(props) {
  return (
    <div className='graph-item'>
        <div className='graph' > 
            <div className='graph-header'>
                <Skeleton width={125} height={40}  />
            </div>
            <hr className='info-seperator'></hr>
            <div className='recent-data'>
                <h3 className='recent-data-main'>
                    <Skeleton width={300} height={50}  />
                </h3>
            </div>
            <div className='recent-log'>
                <p>
                <Skeleton width={350} height={18} />
                </p>
            </div>
            <div className='time-span no-data' style={{ paddingLeft: '30px', paddingTop: '0px', paddingBottom: '0px'}}>
                <Skeleton width={275} height={38} style={{ marginLeft: '20px', paddingTop: '0px', paddingBottom: '0px'}} />
            </div>
            
            <Skeleton variant="rectangular" width={props.width} height={props.height - 15} style={{maxWidth: '550px', margin: 'auto', borderRadius: '8px', marginBottom: '10px'}} />
        </div>
    </div>
  );
}

export default GraphSkeleton;