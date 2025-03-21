import React, { useState } from 'react'
import './PasswordResetPage.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const PasswordResetPage = () => {

  

  const [email, setEmail] = useState('')
  const[newPassword, setNewPassword] = useState('')
  const[isEmailSent, setIsEmailSent]=useState(false)
  const[otp,setOtp] = useState(0)
  const[isOtpSumbited, SetIsOtpSubmited]= useState(false)


  const onSubmitEmail = async(e)=>{
        e.preventDefault();
        
        try{

          const response = await axios.post('http://localhost:4000/api/auth/send-reset-otp',{email});

          if(response.data.success)
          {
            toast.success(response.data.message)
            setIsEmailSent(true)
            
          }
          else{
            toast.error(response.data.message)
          }

        }catch(err)
        {
          console.log(err);
        }
  }

  const OnsubmitNewPassword = async()=>{

    try{
       const response = await axios.post('http://localhost:4000/api/auth/reset-password',{newPassword,otp,email})

       if(response.data.success)
       {
        toast.success('password reset successfully')
       }
    }catch(error)
    {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  return (
    <div className='maincontainer'>
    <div className="container">

      {!isEmailSent &&

    <div className="form-box">
      <h2>Reset Password</h2>
      <p>Enter your registered email address</p>
      <input
        type="email"
        placeholder="Enter your email"
        onChange={e=>setEmail(e.target.value)}
        value={email}
        required
      />
      <button onClick={onSubmitEmail}>Submit</button>
    </div>
      }


      {!isOtpSumbited && isEmailSent &&

    <div className="form-box">
      <h2>Reset Password OTP</h2>
      <p>Enter the 6-digit code sent to your email ID</p>
      <input
        type="text"
        placeholder="Enter OTP"
       onChange={e=>setOtp(e.target.value)}
       value={otp}
        required
      />
      <button onClick={()=>{SetIsOtpSubmited(true)}}>Submit</button>
    </div>
    
    }


    {isOtpSumbited && isEmailSent && 
    <div className="form-box">
      <h2>New Password</h2>
      <p>Enter the new password below</p>
      <input
        type="password"
        placeholder="Enter new password"
        onChange={e=>setNewPassword(e.target.value)}
        value={newPassword}
        required
      />
      <button onClick={OnsubmitNewPassword}>Submit</button>
    </div>}

  </div>
  </div>
  )  
}

export default PasswordResetPage