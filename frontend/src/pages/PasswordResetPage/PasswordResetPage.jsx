import React, { useState } from 'react'
import './PasswordResetPage.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const PasswordResetPage = () => {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/auth/send-reset-otp', { email });
      if (response.data.success) {
        toast.success(response.data.message)
        setIsEmailSent(true)
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false);
    }
  }

  const OnsubmitNewPassword = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/auth/reset-password', { newPassword, otp, email })
      if (response.data.success) {
        toast.success('Password reset successfully')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred')
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pr-main-container">
      <div className="pr-content-wrapper">
        <div className="pr-left-section">
          <div className="pr-hero-content">
            <h1 className="pr-hero-title">Reset Your Password</h1>
            <p className="pr-hero-description">Follow the steps to securely reset your account password and regain access to your account.</p>
            <div className="pr-decorative-elements">
              <div className="pr-decor-circle pr-circle-1"></div>
              <div className="pr-decor-circle pr-circle-2"></div>
              <div className="pr-decor-circle pr-circle-3"></div>
            </div>
          </div>
        </div>
        <div className="pr-right-section">
          <div className="pr-form-container">
            {!isEmailSent && (
              <div className="pr-form-step pr-email-step">
                <div className="pr-step-header">
                  <h2 className="pr-step-title">Reset Password</h2>
                  <p className="pr-step-instruction">Enter your registered email address</p>
                </div>
                <form onSubmit={onSubmitEmail} className="pr-reset-form">
                  <div className="pr-input-container">
                    <label htmlFor="pr-email-input" className="pr-input-label">Email Address</label>
                    <input
                      id="pr-email-input"
                      type="email"
                      placeholder="Enter your email"
                      onChange={e => setEmail(e.target.value)}
                      value={email}
                      required
                      className="pr-form-input"
                    />
                  </div>
                  <button type="submit" disabled={isLoading} className="pr-submit-btn">
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              </div>
            )}

            {!isOtpSubmitted && isEmailSent && (
              <div className="pr-form-step pr-otp-step">
                <div className="pr-step-header">
                  <h2 className="pr-step-title">Verify OTP</h2>
                  <p className="pr-step-instruction">Enter the 6-digit code sent to your email</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setIsOtpSubmitted(true); }} className="pr-reset-form">
                  <div className="pr-input-container">
                    <label htmlFor="pr-otp-input" className="pr-input-label">Verification Code</label>
                    <input
                      id="pr-otp-input"
                      type="text"
                      placeholder="Enter OTP"
                      onChange={e => setOtp(e.target.value)}
                      value={otp}
                      required
                      className="pr-form-input"
                    />
                  </div>
                  <button type="submit" disabled={isLoading} className="pr-submit-btn">
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
              </div>
            )}

            {isOtpSubmitted && isEmailSent && (
              <div className="pr-form-step pr-password-step">
                <div className="pr-step-header">
                  <h2 className="pr-step-title">New Password</h2>
                  <p className="pr-step-instruction">Create a strong, new password</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); OnsubmitNewPassword(); }} className="pr-reset-form">
                  <div className="pr-input-container">
                    <label htmlFor="pr-password-input" className="pr-input-label">New Password</label>
                    <input
                      id="pr-password-input"
                      type="password"
                      placeholder="Enter new password"
                      onChange={e => setNewPassword(e.target.value)}
                      value={newPassword}
                      required
                      className="pr-form-input"
                    />
                  </div>
                  <button type="submit" disabled={isLoading} className="pr-submit-btn">
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordResetPage