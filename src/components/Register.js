import './style/Register.css';
import React, { useState, useEffect } from 'react';
import { css } from "@emotion/react";
import MoonLoader from "react-spinners/MoonLoader";
import { auth, registerWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate  } from 'react-router-dom'

function Register(props) {

    const [checked, setChecked] = useState(true);
    // let [loading, setLoading] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [registerError, setRegisterError] = useState("");
    const [errorText, setErrorText] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [passwordStyle, setPasswordStyle] = useState({});
    const [nameStyle, setNameStyle] = useState({});
    const [emailStyle, setEmailStyle] = useState({});

    const navigate = useNavigate();
    const baseUrl = 'http://localhost:4000'

    useEffect(() => {
    if (loading) {
        // maybe trigger a loading screen
        console.log(loading)
        return;
    }
    if (user){
        return navigate('/dashboard')
    };
    }, [user, loading]);

    useEffect(() => {
        if (registerError.includes("auth/invalid-email")) {
            setErrorText("Invalid email")
            setEmailStyle({'borderColor': 'red'})
        } else if (registerError.includes("auth/weak-password")) {
            setErrorText("Password should be at least 6 charecters")
            setPasswordStyle({'borderColor': 'red'})
        } else if (registerError.includes("auth/email-already-in-use")) {
            setErrorText("An account with that email already exists")
            setEmailStyle({'borderColor': 'red'})
        }
    }, [registerError]);

    const override = css`
    display: block;
    margin: 0 auto;
    margin-top: 10px;
    `;

    function resetError() {
        setNameStyle({})
        setPasswordStyle({})
        setEmailStyle({})
        setErrorText("")
    }

    return (
        <div className="login">
            <div className='content'>
                <h1 className='register-header' >Sign up</h1>

                <div className='errorField'>
                    <p>{errorText}</p>
                </div>
                <form>
                    <div className='entryField'>
                        <label className={"entryLabel"} htmlFor={"name"} >Name</label>
                        <input className='entryInput emailInput' name={'name'} id={'name'} type={'name'} style={nameStyle} onChange={evt => setName(evt.target.value)}></input>
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
                            if(name == "") {
                                flag = false;
                                setNameStyle({'borderColor': 'red'})
                            }
                            if(password == "") {
                                flag = false;
                                setPasswordStyle({'borderColor': 'red'})
                            }
                            if(email == "") {
                                flag = false;
                                setEmailStyle({'borderColor': 'red'})
                            }

                            if(flag) {
                                const attempt = registerWithEmailAndPassword(name, email, password)
                                attempt.then( user => {
                                    console.log(user)
                                    setRegisterError(JSON.stringify(user))
                                }, error => {
                                    console.log(error)
                                    // setRegisterError(JSON.stringify(error))
                                })
                            } else {
                                setErrorText("Fill in all fields")
                            }
                        }
                    }
                    >Sign up</button>
                </form>

                <MoonLoader className='loader' color={"#35A7FF"} loading={loading} css={override} size={25} />
                
                <hr></hr>

                <p>Already have an account? <a href="/"><span>Log in</span></a></p>
            </div>
        </div>
    );
}

export default Register;
