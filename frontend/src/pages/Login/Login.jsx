import React, { useContext, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AppContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      console.log("Submit button clicked");

      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });

      if (response.data.success) {
        console.log("Successfully logged in");
        console.log(response.data);

        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        const role = response.data.role;

        if (role === 'Exporter') {
          navigate('/exporter-dashboard');
        } else if (role === 'Admin') {
          navigate('/admin-dashboard');
        } else if (role === 'Supplier') {
          navigate('/supplier-dashboard');
        } else if (role === 'Employer') {
          navigate('/employee/dashboard');
        }
      } else {
        toast.error(response.data.message || "Invalid email or password");
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="login-container">
      <div className="login-box">
        <div className="welcome-section">
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your account and continue your journey with us.</p>
        </div>
        <div className="form-section">
          <center><h2>Sign In</h2></center>
          <center><p>Please enter your details</p></center>
          <form onSubmit={onSubmitHandler}>
            <input 
              onChange={e => setEmail(e.target.value)} 
              value={email} 
              type="email" 
              placeholder="Enter your email" 
              required 
            />
            <input 
              onChange={e => setPassword(e.target.value)} 
              value={password} 
              type="password" 
              placeholder="Enter your password" 
              required 
            />
            <div className="checkbox-row">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a className="forgot-password" onClick={() => navigate('/password-reset')}>
                Forgot Password?
              </a>
            </div>
            <button type="submit">Sign In</button>
          </form>
          <p className="signup-text">Don't have an account? Contact admin</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;