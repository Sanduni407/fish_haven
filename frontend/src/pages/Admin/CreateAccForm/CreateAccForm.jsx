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
    <div className="create-acc-form-container">
      <div className="create-acc-form-left-column">
        <SideNavBar role={"Admin"} />
      </div>
      <div className="create-acc-form-right-column">
        <Form>
          <Row className="create-acc-form-row">
            <Col>
              <Form.Label className="create-acc-form-label">Full Name</Form.Label>
              <Form.Control className="create-acc-form-control" type="text" name="name" onChange={(e) => setName(e.target.value)} value={name} required />
            </Col>
            <Col>
              <Form.Label className="create-acc-form-label">Business Name</Form.Label>
              <Form.Control className="create-acc-form-control" type="text" name="businessName" onChange={(e) => setBusinessName(e.target.value)} value={businessName} />
            </Col>
          </Row>

          <Row className="create-acc-form-row">
            <Col>
              <Form.Label className="create-acc-form-label">Business Reg No</Form.Label>
              <Form.Control className="create-acc-form-control" type="text" name="businessRegNo" onChange={(e) => setBusinessRegNo(e.target.value)} value={businessRegNo} />
            </Col>
            <Col>
              <Form.Label className="create-acc-form-label">Email</Form.Label>
              <Form.Control className="create-acc-form-control" type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
            </Col>
            <Col>
              <Form.Label className="create-acc-form-label">Contact No</Form.Label>
              <Form.Control className="create-acc-form-control" type="text" name="phone" onChange={(e) => setPhone(e.target.value)} value={phone} required />
            </Col>
          </Row>

          <Row className="create-acc-form-row">
            <Col>
              <Form.Label className="create-acc-form-label">Address</Form.Label>
              <Form.Control className="create-acc-form-control" type="text" name="address" onChange={(e) => setAddress(e.target.value)} value={address} required />
            </Col>
          </Row>

          <Row className="create-acc-form-row">
            <Col>
              <Form.Label className="create-acc-form-label">Role</Form.Label>
              <Form.Select className="create-acc-form-select" onChange={(e) => setRole(e.target.value)}>
                <option>Select role</option>
                <option value="Exporter">Exporter</option>
                <option value="Supplier">Supplier</option>
                <option value="Employer">Employer</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Label className="create-acc-form-label">Password</Form.Label>
              <Form.Control className="create-acc-form-control" type="text" name="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
            </Col>
          </Row>
        </Form>
        <center>
          <button onClick={createAccount} className="create-acc-form-button">
            Create account
          </button>
        </center>
      </div>
    </div>
  );
};

export default CreateAccForm;