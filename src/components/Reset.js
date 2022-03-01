import './style/Login.css';
import React, { useState, useEffect } from 'react';
import { css } from "@emotion/react";
import MoonLoader from "react-spinners/MoonLoader";
import { auth, sendPasswordReset } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate  } from 'react-router-dom'

function Reset(props) {

    const [checked, setChecked] = useState(true);
    // let [loading, setLoading] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const baseUrl = 'http://localhost:4000'

    useEffect(() => {
    if (loading) {
        // maybe trigger a loading screen
        return;
    }
    if (user){
        return <Navigate  to='/home' />
    };
    }, [user, loading]);

    const override = css`
    display: block;
    margin: 0 auto;
    margin-top: 10px;
    `;

    return (
        <div className="login">
            <div className='content'>
                <h1 className='login-header'>Reset Password</h1>

                <div className='entryField'>
                    <label className={"entryLabel"} htmlFor={"email"} >Email</label>
                    <input className='entryInput emailInput' name={'email'} id={'email'} type={'email'} onChange={evt => setEmail(evt.target.value)}></input>
                </div>

                <button className='login-btn'
                onClick={() => sendPasswordReset(email)}
                >Send password reset link</button>

                <MoonLoader className='loader' color={"#35A7FF"} loading={loading} css={override} size={25} />
                
                <hr></hr>

                <p>Don't have an account? <a href="/register"><span>Sign up</span></a></p>
            </div>
        </div>
    );
}

export default Reset;
