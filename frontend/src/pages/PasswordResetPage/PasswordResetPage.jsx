import React, { useState } from 'react';
import './PasswordResetPage.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PasswordResetPage = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  //  Function to send OTP email
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/auth/send-reset-otp', { email });

      if (response.data.success) {
        toast.success(response.data.message);
        setIsEmailSent(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred. Please try again.');
    }
  };

  //  OTP Validation & Submission
  const handleOtpSubmit = () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP'); // Prevents blank OTP submissions
      return;
    }
    setIsOtpSubmitted(true);
  };

  //  Password Validation
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{5,}$/;
    return passwordRegex.test(password);
  };

  //  Submitting the new password
  const onSubmitNewPassword = async () => {
    if (!validatePassword(newPassword)) {
      toast.error('Password must be at least 5 characters long, contain at least one uppercase letter, and one number.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/auth/reset-password', { newPassword, otp, email });

      if (response.data.success) {
        toast.success('Password reset successfully');
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while resetting your password.');
    }
  };

  return (
    <div className='maincontainer'>
      <div className="container">
        {/* Email Input for OTP */}
        {!isEmailSent &&
          <div className="form-box">
            <h2>Reset Password</h2>
            <p>Enter your registered email address</p>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={e => setEmail(e.target.value)}
              value={email}
              required
            />
            <button onClick={onSubmitEmail}>Submit</button>
          </div>
        }

        {/* OTP Input Section */}
        {!isOtpSubmitted && isEmailSent &&
          <div className="form-box">
            <h2>Reset Password OTP</h2>
            <p>Enter the 6-digit code sent to your email ID</p>
            <input
              type="text"
              placeholder="Enter OTP"
              onChange={e => setOtp(e.target.value)}
              value={otp}
              required
            />
            <button onClick={handleOtpSubmit}>Submit</button>
          </div>
        }

        {/* New Password Section */}
        {isOtpSubmitted && isEmailSent &&
          <div className="form-box">
            <h2>New Password</h2>
            <p>Enter the new password below</p>
            <input
              type="password"
              placeholder="Enter new password"
              onChange={e => setNewPassword(e.target.value)}
              value={newPassword}
              required
            />
            <button onClick={onSubmitNewPassword}>Submit</button>
          </div>
        }
      </div>
    </div>
  );
};

export default PasswordResetPage;
