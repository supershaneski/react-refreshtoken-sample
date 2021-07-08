import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { login, getlist, getapi } from './server';
import store from './store';

function Clock() {

  const [time, setTime] = useState((new Date()).toLocaleTimeString()) 
  useEffect(() => {
    const tim = setInterval(() => {
      setTime((new Date()).toLocaleTimeString())
    }, 1000)
    return () => {
      clearInterval(tim)
    }
  },[])

  return (
    <span style={{fontSize: '0.81em', color: '#555'}}>{ time }</span>
  )

}

const API_KEY = "abcdefgh123456";

function App() {

  const [state, setState] = useState(0)

  const [loginId, setLoginId] = useState("namae");
  const [password, setPassword] = useState("pasuwado");
  const [errorMsg, setErrorMsg] = useState("");

  const [token, setToken] = useState({ token: "", rtoken: "" });
  
  const handleLogin = () => {

    const tokens = store.getTokens();
    console.log(tokens)
    
    login({
      id: loginId,
      password: password,
      apikey: API_KEY,
    }).then(response => {

      console.log("response", response.data.token, response.data.rtoken)
      console.log("apikey", response.data.apikey)

      if(response.data.status === 200) {

        // display purpose only
        setToken({
          token: response.data.token,
          rtoken: response.data.rtoken,
        })

        // real data
        store.setTokens({ 
          token: response.data.token,
          rtoken: response.data.rtoken,
        })

        setState(1)
        setErrorMsg("")

      } else {

        console.log("Unexpected error")

        setErrorMsg("Unexpected error")

      }

    }).catch(error => {
      
      console.log("error", error.message)

      setErrorMsg(error.message)

    })

  }

  const handleLogout = () => {

    setToken({
      token: "",
      rtoken: "",
    })

    store.clearTokens();

    setState(0)

  }

  const handleList = () => {

    const tokens = store.getTokens();

    console.log("tokens", tokens)

    getlist(tokens.token, tokens.rtoken).then(response => {

      console.log("received", response)

      const otokens = store.getTokens();

      setToken({
        token: otokens.token,
        rtoken: otokens.rtoken,
      })

    }).catch(error => {

      console.log("error", error)

    })

  }

  const handleAPI = () => {

    const tokens = store.getTokens();
    
    getapi("/list.php", tokens.token, tokens.rtoken).then(response => {

      console.log(response)

      const otokens = store.getTokens();

      setToken({
        token: otokens.token,
        rtoken: otokens.rtoken,
      })

    }).catch(error => {

      console.log(error)
    
    })

  }

  return (
    <div className="container">
      <div className="header">
        <img src={logo} className="logo" alt="logo" />
      </div>
      <div className="main">
        {
          state === 0 &&
          <div className="form-login">
            <h4 className="form-title">Sign In <Clock /></h4>
            <label className="form-label">Login ID</label>
            <input className="form-input" type="text" value={loginId} onChange={e => setLoginId(e.target.value)}/>
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
            {
              errorMsg &&
              <div className="form-error">{ errorMsg }</div>
            }
            <div className="form-action">
              <button className="form-button" onClick={handleLogin}>Submit</button>
            </div>
          </div>
        }
        {
          state === 1 &&
          <div className="panel">
            <div className="panel-timer">
              <Clock />
              <div className="token-panel">
                <div className="span">Token: { token.token }</div>
                <div className="span">Refresh: { token.rtoken }</div>
              </div>
              <button className="form-button" onClick={handleList}>GET LIST</button>
              <button className="form-button" onClick={handleAPI}>GET API</button>
              <button className="form-button" onClick={handleLogout}>Sign Out</button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
