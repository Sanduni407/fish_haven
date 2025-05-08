import React, { useState } from 'react';
import './ExporterRegisterForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

const ExporterRegisterForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessRegNo, setBusinessRegNo] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email format';
    }

    if (!phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const requestRegistration = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      const response = await axios.post('http://localhost:4000/api/reg-request/create-request', {
        name,
        businessName,
        businessRegNo,
        address,
        email,
        phone,
      });

      if (response.data.success) {
        console.log(response.data);
        alert('Registration request submitted successfully!');
        navigate('/');
      } else {
        console.log(response.data);
        alert('Failed to submit request.');
      }
    } catch (err) {
      console.log(err);
      alert('An error occurred.');
    }
  };

  return (
    <>
    <Navbar/>
    <div className="exporter-form-container">
      <div className="exporter-form-box">
        <div className="welcome-section">
          <h2>Register as an Exporter</h2>
          <p>Fill in your details to join our platform and start your journey with us.</p>
        </div>
        <form className="exporter-form" onSubmit={requestRegistration}>
          <h3>Exporter Registration</h3>
          <p>Please enter your details</p>

          <label>Name</label>
          <input type="text" name="name" onChange={(e) => setName(e.target.value)} value={name} required />

          <label>Business Name</label>
          <input type="text" name="businessName" onChange={(e) => setBusinessName(e.target.value)} value={businessName} required />

          <label>Business Registration Number</label>
          <input type="text" name="businessRegNo" onChange={(e) => setBusinessRegNo(e.target.value)} value={businessRegNo} required />

          <label>Email</label>
          <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
          {errors.email && <p className="error">{errors.email}</p>}

          <label>Phone</label>
          <input type="text" name="phone" onChange={(e) => setPhone(e.target.value)} value={phone} required />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <label>Address</label>
          <input type="text" name="address" onChange={(e) => setAddress(e.target.value)} value={address} required />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
    </>
  );
};

export default ExporterRegisterForm;