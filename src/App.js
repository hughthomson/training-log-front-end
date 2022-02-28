import './App.css';
import Nav from './components/Nav'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Register from './components/Register'
import Reset from './components/Reset'
import RecordLog from './components/RecordLog';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "./firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/record_log" element={<RecordLog />} />
        </Routes>
      </BrowserRouter>
    </div>
  );

  
}

export default App;
