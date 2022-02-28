import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import Nav from './Nav'
import './style/Dashboard.css'
import Graph from "./Graph";
import RecordLogPopUpButton from "./RecordLogPopUpButton"
import { AiOutlineHistory } from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
import axios from "axios";

function Dashboard() {

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [graphData, setGraphData] = useState({});
  const [userLifts, setUserLifts] = useState([]);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [liftGraphs, setLiftGraphs] = useState([]);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const navigate = useNavigate();
  const graphHeight = 275
  const baseApiUrl = process.env.REACT_APP_API_ADDRESS

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  // const addUser = async () => {
  //   console.log()
  //   try {
  //     axios.post(baseApiUrl + 'add_user', {uid: user?.uid})
  //     .then(res => {
  //       console.log(res.data);
  //     })
  //   } catch(err) {
  //     console.log(err)
  //   }
  // }

  // const getUserLifts = async () => {
  //   try {
  //     axios.post(baseApiUrl + 'user_lifts', {uid: user?.uid})
  //     .then(res => {
  //       console.log(res.data);
  //       let userLifts = res.data
  //       if(userLifts === '') {
  //         addUser()
  //       }
  //     })
  //   } catch(err) {
  //     console.log(err)
  //   }
  // }

  function createGraphDataObj(trackedItems, graphPoints) {
    let graphDataObj = {}

    for(let i = 0; i < trackedItems.length; i++) {
      graphDataObj[trackedItems[i]] = []
      for(let j = 0; j < graphPoints.length; j++) {
        if(trackedItems[i] === graphPoints[j].tracked_item) {
          graphDataObj[trackedItems[i]].push(graphPoints[j])
        }
      }
    }

    return graphDataObj

  }

  const getUserData = async () => {
    setGraphData(false)
    let userData = await axios.get(baseApiUrl + 'user/' + user?.uid)
    let logs = await axios.get(baseApiUrl + 'logs/' + user?.uid)

    let trackedItems = userData.data.user.tracked_items
    let graphPoints = logs.data.logs;
    let graphDataObj = formatGraphData(createGraphDataObj(trackedItems, graphPoints), trackedItems)
    setUserLifts(trackedItems)
    setGraphData(graphDataObj)
  }

  const getLogData = async () => {
    let logs = await axios.get(baseApiUrl + 'logs/' + user?.uid)
    let graphPoints = logs.data.logs;
    let graphDataObj = formatGraphData(createGraphDataObj(userLifts, graphPoints), userLifts)
    setGraphData(graphDataObj)
  }

  function calculateOneRepMax(reps, weight) {
    return(
      (Math.round(
        ((parseInt(weight) * parseInt(reps) * (1/30) + parseInt(weight)) + Number.EPSILON) * 100) / 100)
    )
  }

  function formatGraphData(data, trackedItems) {
    let graphDataObj = data

    for(let i = 0; i < trackedItems.length; i++) {
      let logs = graphDataObj[trackedItems[i]]
      logs.sort(function(a, b){
        return new Date(a.date) - new Date(b.date);
      });
    }

    for(let i = 0; i < trackedItems.length; i++) {
      let logs = graphDataObj[trackedItems[i]]
      if(logs.length === 0) {
        graphDataObj[trackedItems[i]] = [{
          date: new Date(),
          oneRepMax: 0,
          reps: 0,
          tracked_item: trackedItems[i],
          weight: 0,
        }]
      } else {
        for(let j = 0; j < logs.length; j++) {
          let date = new Date(logs[j].date)
          let reps = parseInt(logs[j].reps)
          let weight = parseInt(logs[j].weight)
          let oneRepMax = calculateOneRepMax(reps, weight)
          logs[j].date = date
          logs[j].reps = reps
          logs[j].weight = weight
          logs[j].oneRepMax = oneRepMax
        }
      }
    }

    console.log(graphDataObj)

    return graphDataObj;
  }

  useEffect(() => {
    if (userLifts.length && Object.keys(graphData).length !== 0) {
      console.log("Create graphs with this data", userLifts, graphData)
      setUserDataLoaded(true);
    } else {
      console.log("Graph data not ready")
    }
  }, [userLifts, graphData]);



  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    getUserData();
    // getUserLifts();
  }, [user, loading]);

  const data = [
    {
      name: "Jan 5",
      Weight: 183.0
    },
    {
      name: "Jan 12",
      Weight: 189.0
    },
    {
      name: "Jan 19",
      Weight: 186.0
    },
    {
      name: "Jan 26",
      Weight: 195.0
    },
    {
      name: "Feb 2",
      Weight: 192.0
    },
  ];

  return ( 
    <div className="dashboard">
      <Nav />
      <div className="dashboard-container">
        <div className="action-center">
          <RecordLogPopUpButton updateData={getLogData} />
          <button className="icon-button green" onClick={() => navigate('/history')}><span className="icon"><AiOutlineHistory /></span> View log history</button>
          <button className="icon-button gray" onClick={() => navigate('/settings')}><span className="icon"><IoSettingsOutline /></span> Settings</button>
        </div>
        <h2 id="tracked-lifts-header">Tracked Lifts</h2>
      </div>
      {userDataLoaded ? 
        <>
          <div className="tracked-lifts-container">
            {userDataLoaded ? 
              userLifts.map(function(lift, index) {
                return(<Graph data={graphData[lift]} width={windowDimensions.width - 25} height={graphHeight} label={lift} unit={"lbs"} dataKey={"oneRepMax"} key={index} />)
              })
              :
              <div className="nothng">dsfa</div>
            }
            {/* <Graph data={data} width={windowDimensions.width - 25} height={graphHeight} label={"Bench Press"} unit={"lbs"} />
            <Graph data={data} width={windowDimensions.width - 25} height={graphHeight} label={"Squat"} unit={"lbs"} />
            <Graph data={data} width={windowDimensions.width - 25} height={graphHeight} label={"Deadlift"} unit={"lbs"} />
            <Graph data={data} width={windowDimensions.width - 25} height={graphHeight} label={"Shoulder Press"} unit={"lbs"} /> */}
          </div>

          <div className="secondary-section">
            <div className="dashboard-container">
              <h2 id="tracked-lifts-header">Body Metrics</h2>
            </div>
            <div className="body-metrics-container">
              {/* <Graph data={data} width={windowDimensions.width - 25} height={graphHeight} label={"Body Weight"} dataKey={"Weight"} unit={"lbs"}/>
              <Graph data={data} width={windowDimensions.width - 25} height={graphHeight} label={"Calories"} dataKey={"Weight"} unit={"kcal"} /> */}
            </div>
          </div>
        </>
        :
        <div>loading...</div>
      }
    </div>
  );
}

export default Dashboard;
