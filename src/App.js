import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="header">
        <img src={logo} className="logo" alt="logo" />
      </div>
      <div className="main">
        
        <div className="login">
        <h4>Sign In</h4>
        <label>Login ID</label>
        <input type="text" placeholder=""/>
        <label>Password</label>
        <input type="text" placeholder=""/>
        </div>
      
      </div>
    </div>
  );
}

export default App;
