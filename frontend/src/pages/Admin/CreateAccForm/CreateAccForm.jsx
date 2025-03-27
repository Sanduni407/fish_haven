import React, { useEffect, useState } from 'react';
import './CreateAccForm.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SideNavBar from '../../../components/SideNavBar/SideNavBar';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';

const CreateAccForm = () => {
  const { id } = useParams(); // Get order ID from URL
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessRegNo, setBusinessRegNo] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  // Fetch data of a request related to the exporter registration request
  const fetchRequestData = async () => {
    if (id) {
      try {
        const response = await axios.get(`http://localhost:4000/api/reg-request/get-a-request/${id}`);

        if (response.data.success) {
          const request = response.data.request;

          setName(request.name);
          setBusinessName(request.businessName);
          setBusinessRegNo(request.businessRegNo);
          setAddress(request.address);
          setEmail(request.email);
          setPhone(request.phone);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchRequestData();
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone); // Must be exactly 10 digits
  };

  // Create new user account
  const createAccount = async () => {
    if (!validateEmail(email)) {
      toast.error('Invalid email format.');
      return;
    }

    if (!validatePhone(phone)) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', {
        name, businessName, businessRegNo, address, email, phone, role, password
      });

      if (response.data.success) {
        console.log(response.data.message);
        toast.success('Account created successfully');
        navigate('/admin-users');
      } else {
        console.log('error');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-create-acc-container">
      <div className="left-column">
        <SideNavBar role={"Admin"} />
      </div>
      <div className="right-column">
        <Form style={{ marginTop: '50px' }}>
          <Row>
            <Col>
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="name" onChange={(e) => setName(e.target.value)} value={name} required />
            </Col>
            <Col>
              <Form.Label>Business Name</Form.Label>
              <Form.Control type="text" name="businessName" onChange={(e) => setBusinessName(e.target.value)} value={businessName} />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Label>Business Reg No</Form.Label>
              <Form.Control type="text" name="businessRegNo" onChange={(e) => setBusinessRegNo(e.target.value)} value={businessRegNo} />
            </Col>
            <Col>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
            </Col>
            <Col>
              <Form.Label>Contact No</Form.Label>
              <Form.Control type="text" name="phone" onChange={(e) => setPhone(e.target.value)} value={phone} required />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" onChange={(e) => setAddress(e.target.value)} value={address} required />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Label>Role</Form.Label>
              <Form.Select onChange={(e) => setRole(e.target.value)}>
                <option>Select role</option>
                <option value="Exporter">Exporter</option>
                <option value="Supplier">Supplier</option>
                <option value="Employer">Employer</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Password</Form.Label>
              <Form.Control type="text" name="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
            </Col>
          </Row>
        </Form>

        <center>
          <button onClick={createAccount} style={{ backgroundColor: '#49557e', color: 'white', width: '300px', marginTop: '20px' }}>
            Create account
          </button>
        </center>
      </div>
    </div>
  );
};

export default CreateAccForm;
