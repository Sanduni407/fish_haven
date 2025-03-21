import React, { useState } from 'react'
import './ExporterRegisterForm.css'
import axios from 'axios'

const ExporterRegisterForm = () => {

  const[name,setName] = useState('');
  const[ businessName,setbusinessName] = useState('');
  const[ businessRegNo,setbusinessRegNo] = useState('');
  const[address,setaddress] = useState('');
  const[ email,setemail] = useState('');
  const[ phone,setphone] = useState('');


  const requestRegistration = async(e)=>{

     e.preventDefault()
    try{

      const response = await axios.post('http://localhost:4000/api/reg-request/create-request', {name,businessName,businessRegNo,address,email,phone});

      if(response.data.success)
      {
        console.log(response.data)
      }
      else
      {
        console.log(response.data)
      }

    }catch(err){

       console.log(err)
    }
  }
  
  return (
    <div className="exporter-form-container">
      <form className="exporter-form" onSubmit={requestRegistration}>

        <label>Name</label>
        <input type="text" name="name" onChange={(e=>setName(e.target.value))} value={name} required />

        <label>Business Name</label>
        <input type="text" name="businessName" onChange={(e=>setbusinessName(e.target.value))} value={businessName} required />

        <label>Business Registration Number</label>
        <input type="text" name="businessRegNo" onChange={(e=>setbusinessRegNo(e.target.value))} value={businessRegNo} required />

        <label>Email</label>
        <input type="email" name="email"  onChange={(e=>setemail(e.target.value))} value={email} required />

        <label>Phone</label>
        <input type="text" name="phone" onChange={(e=>setphone(e.target.value))} value={phone} required />

        <label>Address</label>
        <input type="text" name="address" onChange={(e=>setaddress(e.target.value))} value={address}  required />

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default ExporterRegisterForm