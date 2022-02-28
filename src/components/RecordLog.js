import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './style/RecordLog.css'
import { AiOutlineDelete, AiOutlineCheck } from 'react-icons/ai';
import DropDown from "./DropDown";
import BouncingDotsLoader from "./BouncingDotsLoader";
import axios from 'axios';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import MoonLoader from "react-spinners/MoonLoader";
import ClipLoader from 'react-spinners/ClipLoader'
import BarLoader from 'react-spinners/BarLoader'
import { css } from "@emotion/react";

function RecordLog(props) {

  const [user, loading, error] = useAuthState(auth);
  const [data, setData] = useState({exercise: '', date: '', weight: '', reps: ''});
  const [logLoading, setLogLoading] = useState(false);
  const navigate = useNavigate();
  const baseApiUrl = process.env.REACT_APP_API_ADDRESS

  const override = css`
    display: block;
    width: 100%;
    `;


  function updateReps(inputData) {
    let temp = data
    temp.reps = inputData
    setData(JSON.parse(JSON.stringify(temp)))
  }

  function updateWeight(inputData) {
    let temp = data
    temp.weight = inputData
    setData(JSON.parse(JSON.stringify(temp)))
  }

  function updateExercise(inputData) {
    let temp = data
    temp.exercise = inputData
    setData(JSON.parse(JSON.stringify(temp)))
  }

  function updateDate(inputData) {
    console.log(inputData)
    let temp = data
    temp.date = inputData
    setData(JSON.parse(JSON.stringify(temp)))
  }

  function submitLog() {
    data.uid = user?.uid;
    setLogLoading(true)
    try {
      axios.post(baseApiUrl + 'log-lift', data)
      .then(res => {
        console.log(res)
        console.log(res.data);
        deleteLog()
        props.close()
        props.updateData()
        setLogLoading(false)
      }).catch(err => {
        console.log(err.message)
        deleteLog()
        props.close()
        setLogLoading(false)
      })
    } catch(err) {
      console.log(err.message)
    }
  }

  function deleteLog() {
    setData({exercise: '', date: '', weight: '', reps: ''})
    props.close()
  }

  function isNumber(inputData) {
    if(parseInt(inputData)) {
      return true
    } else {
      return false
    }
  }

  function calculateOneRepMax(reps, weight) {
    return(
      (Math.round(
        ((parseInt(weight) * parseInt(reps) * (1/30) + parseInt(weight)) + Number.EPSILON) * 100) / 100).toFixed(2)
    )
  }

  return (
    <div className="record-log">
      <div className="record-log-container">
        {/* <div className="input-section-box">
          <h2 id="tracked-lifts-header">Log a Lift</h2>
        </div> */}
        <div className="input-section">
          <div className="input-card">
              <DropDown options={['Squat', 'Deadlift', 'Bench', 'Shoulder Press']} value={data.exercise} update={updateExercise} isShowing={props.isShowing} />
              <div className="numer-row">
                <input className="number-input" placeholder="Weight" type={"number"} pattern="\d*"
                  value={data.weight}
                  onChange={(e) => {
                    updateWeight(e.target.value)
                  }}
                ></input>
                <input className="number-input" placeholder="Reps" type={"number"} pattern="\d*"
                  value={data.reps}
                  onChange={(e) => {
                    updateReps(e.target.value)
                  }}
                ></input>
              </div>
              <div className="rep-max-estimator">
                <span>
                  ESTIMATED 1RM -&nbsp;
                  {( data.weight === 0) ? "__ LBS " : data.weight + " LBS "} 
                  x 
                  {( data.reps === 0) ? " __" : " " + data.reps + ' '} 
                  = 
                </span>
                &nbsp;
                {
                ( !isNumber(data.weight) || !isNumber(data.reps) ) 
                ? 
                <BouncingDotsLoader /> 
                : 
                calculateOneRepMax(data.reps, data.weight) + " LBS"}
              </div>
              <input 
                className="date-input" 
                placeholder="Date" 
                type="date"
                value={data.date}
                onChange={(e) => {
                  updateDate(e.target.value)
                }}
              ></input>
          </div>
        </div>
        { 
          (logLoading) ?
          <div className="loader-container">
            {/* <MoonLoader /> */}
            {/* <ClipLoader className='loader' color={'#35A7FF'} loading={logLoading} css={override} size={25} /> */}
            <BarLoader className='loader' color={'#35A7FF'} loading={logLoading} css={override} size={25} />
            {/* <p className="loader-text">Saving log</p> */}
            {/* <BouncingDotsLoader className='saving-dots' /> */}
          </div> 
          :
          <div className="action-center-submit"> 
            <button className="icon-button red log" onClick={deleteLog}><span className="icon"><AiOutlineDelete /></span>Delete log</button>
            <button className="icon-button green log" onClick={() => {submitLog()}}><span className="icon"><AiOutlineCheck /></span>Log workout</button>
          </div>
        }
        
      </div>
    </div>
  );
}

export default RecordLog;
