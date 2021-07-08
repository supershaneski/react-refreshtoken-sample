import React, { useState } from 'react';
import logo from './logo.svg';
import server from './server';
import store from './store';
import './App.css';

function App() {

  const [state, setState] = useState(0)
  const [loginId, setLoginId] = useState("namae")
  const [password, setPassword] = useState("pasuwado")
  const [errorMsg, setErrorMsg] = useState(" ")
  const [statusMsg, setStatusMsg] = useState(" ")
  const [token, setToken] = useState({ token: "", rtoken: "" })
  
  const handleLogin = () => {

    server.login(loginId, password).then(response => {

      if(response.data.status === 200) {

        setToken({
          token: response.data.token,
          rtoken: response.data.rtoken,
        })

        store.setTokens({
          token: response.data.token,
          rtoken: response.data.rtoken,
        })

        setState(1)
        setErrorMsg(" ")

      } else {

        setErrorMsg("Unexpected error")

      }

    }).catch(error => {
      
      setErrorMsg(error.message)

    })

  }

  const handleLogout = () => {

    setErrorMsg(" ")
    setStatusMsg(" ")

    setToken({
      token: "",
      rtoken: "",
    })

    store.clearTokens()

    setState(0)

  }
  
  const handleAPI = () => {

    setErrorMsg(" ")
    setStatusMsg(" ")

    const tokens = store.getTokens()
    
    server.getapi("/list", tokens.token, tokens.rtoken).then(response => {

      console.log(response)

      if(response.data.status === 200) {
        
        const otokens = store.getTokens()

        if(otokens.token !== token.token) {

          setToken({
            token: otokens.token,
            rtoken: otokens.rtoken,
          })

          setErrorMsg("Token refreshed")

        }
        
        setStatusMsg("Received reply")
        
      } else {

        setErrorMsg("Unexpected error")

      }
      
    }).catch(error => {

      console.log(error)

      setErrorMsg(error.message)
    
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
            <h4 className="form-title">Sign In</h4>
            <label className="form-label">Login ID</label>
            <input className="form-input" type="text" value={loginId} onChange={e => setLoginId(e.target.value)}/>
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
            <div className="form-error">{ errorMsg }</div>
            <div className="form-action">
              <button className="form-button" onClick={handleLogin}>Submit</button>
            </div>
          </div>
        }
        {
          state === 1 &&
          <div className="panel">
            <div className="panel-inner">
              <div className="token-panel">
                <div className="span">Token: { token.token }</div>
                <div className="span">Refresh: { token.rtoken }</div>
              </div>
              <div className="form-error">{ errorMsg }</div>
              <button className="form-button" onClick={handleAPI}>Get API</button>
              <button className="form-button" onClick={handleLogout}>Clear Tokens</button>
              <div className="form-status">{ statusMsg }</div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default App;
