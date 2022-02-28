import './style/Login.css';
import React, { useState, useEffect } from 'react';
import { css } from "@emotion/react";
import MoonLoader from "react-spinners/MoonLoader";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate  } from 'react-router-dom'

function Login(props) {

    const [checked, setChecked] = useState(true);
    
    // let [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const baseUrl = 'http://localhost:4000'

    const [passwordStyle, setPasswordStyle] = useState({});
    const [emailStyle, setEmailStyle] = useState({});
    const [registerError, setRegisterError] = useState("");
    const [errorText, setErrorText] = useState("");

    function resetError() {
        setPasswordStyle({})
        setEmailStyle({})
        setErrorText("")
    }

    useEffect(() => {
        if (registerError.includes("auth/user-not-found")) {
            setErrorText("Email does not exist")
            setEmailStyle({'borderColor': 'red'})
        } else if (registerError.includes("auth/wrong-password")) {
            setErrorText("Incorrect password")
            setPasswordStyle({'borderColor': 'red'})
        } else if (registerError.includes("auth/email-already-in-use")) {
            setErrorText("An account with that email already exists")
            setEmailStyle({'borderColor': 'red'})
        } else if (registerError.includes("auth/too-many-requests")) {
            setErrorText("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.")
            setEmailStyle({'borderColor': 'red'})
            setPasswordStyle({'borderColor': 'red'})
        }
    }, [registerError]);

    useEffect(() => {
    if (loading) {
        // return(<div className='loader'>Loader</div>);
    } 

    if (user){
        return navigate("/dashboard");
    } 
    console.log(loading)
    }, [user, loading]);

    useEffect(() => {
        if (error) {
            console.log(error)
        }
    }, [error])

    const override = css`
    display: block;
    margin: 0 auto;
    margin-top: 10px;
    `;

    return (
        <div className='container'>

            {
                (loading || user) 
                ?
                <div></div>
                :
                <div className="login">
                <div className='content'>
                    <h1 className='login-header'>Log in</h1>

                    <button className="login-with-google-btn" onClick={signInWithGoogle}>
                        <img src='https://d3ptyyxy2at9ui.cloudfront.net/google-32ae27.svg' /> Continue with Google
                    </button>

                    <hr></hr>
                    <form>
                        <div className='errorField'>
                            <p>{errorText}</p>
                        </div>

                        <div className='entryField'>
                            <label className={"entryLabel"} htmlFor={"email"} >Email</label>
                            <input className='entryInput emailInput' name={'email'} id={'email'} style={emailStyle} type={'email'} onChange={evt => setEmail(evt.target.value)}></input>
                        </div>

                        <div className='entryField'>
                            <label className={"entryLabel"} htmlFor={"password"}>Password</label>
                            <input className='entryInput passwordInput' name={'password'} id={'password'} style={passwordStyle} type={'password'} onChange={evt => setPassword(evt.target.value)}></input>
                        </div>

                        <button className='login-btn'
                        onClick={
                            (e) => {
                                e.preventDefault()
                                resetError()
                                let flag = true;
                                if(password == "") {
                                    flag = false;
                                    setPasswordStyle({'borderColor': 'red'})
                                }
                                if(email == "") {
                                    flag = false;
                                    setEmailStyle({'borderColor': 'red'})
                                }
                                
                                if(flag) {
                                    const attempt = logInWithEmailAndPassword(email, password)
                                    attempt.then( user => {
                                        console.log(user)
                                        setRegisterError(JSON.stringify(user))
                                    }, error => {
                                        console.log(error)
                                    })
                                } else {
                                    setErrorText("Fill in all fields")
                                }
                            }
                        }
                        >Log in</button>
                    </form>


                    <MoonLoader className='loader' color={"#35A7FF"} loading={loading} css={override} size={25} />
                    
                    <label className="stayLoginLabel" htmlFor="permanentLogin">
                        <input type="checkbox" name={"permanentLogin"} id={"permanentLogin"} value="1" checked={checked}
                        onChange={() => {setChecked(!checked)}}
                        />Keep me logged in
                    </label>

                    <p><a className='link' href="/reset"><span>Forgot your password? </span></a></p>
                    
                    <hr></hr>
                    
                    <p>Don't have an account? <a className='link' href="/register"><span>Sign up</span></a></p>
                    </div>
                    </div>
            }
        </div>
    );
}

export default Login;
