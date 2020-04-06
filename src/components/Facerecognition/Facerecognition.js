import React from 'react';
import './Facerecognition.css';

const Facerecognition = ({imageurl,box}) => {
	return(
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id = 'inputImage' alt='' src={imageurl} width='500px' height='auto'/>
				<div className='bounding-box' style={{right: box.rightCol,top: box.topRow,bottom: box.bottomRow, left: box.leftCol}}></div>
			</div>	
		</div> 
		);
		}
 
 
export default Facerecognition;