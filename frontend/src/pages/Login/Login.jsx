import React, { useContext, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

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
          navigate('/supplier/add-fish');
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
    <div className="login-container">
      <div className="login-box">
        <h2>Sign In</h2>
        <form onSubmit={onSubmitHandler}>
          <input 
            onChange={e => setEmail(e.target.value)} 
            value={email} 
            type="email" 
            placeholder="Email" 
            required 
          />

          <input 
            onChange={e => setPassword(e.target.value)} 
            value={password} 
            type="password" 
            placeholder="Password" 
            required 
          />

          <a className="forgot-password" onClick={() => navigate('/password-reset')}>
            Forgot Password?
          </a>

          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
