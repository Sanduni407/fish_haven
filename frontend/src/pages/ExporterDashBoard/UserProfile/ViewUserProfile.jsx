import React, { useContext, useEffect, useState } from 'react'
import './ViewUserProfile.css'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import SideNavBar from '../../../components/SideNavBar/SideNavBar';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

// View User Profile

const ViewUserProfile = () => {

  const { token } = useContext(AppContext)

  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [businessName, setbusinessName] = useState('')
  const [businessRegNo, setbusinessRegNo] = useState('')
  const [email, setemail] = useState('')
  const [phone, setphone] = useState('')
  const [address, setaddress] = useState('')

  const [modalShow, setModalShow] = useState(false);

  const fetchUserProfileData = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/get-user', {}, { headers: { token } });
      if (response.data.success) {
        console.log(response.data.user)
        const user = response.data.user;
        setId(user._id)
        setName(user.name)
        setbusinessName(user.businessName)
        setbusinessRegNo(user.businessRegNo)
        setemail(user.email)
        setphone(user.phone)
        setaddress(user.address)
      } else {
        console.log('Error')
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchUserProfileData()
  }, [])

  //update user details

  const updateUser = async () => {
    // Email validation 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;

    // Validate email
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return; // Stop further execution if email is invalid
    }

    // Validate phone number
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid phone number (10 digits).");
      return; // Stop further execution if phone number is invalid
    }

    try {
      const response = await axios.put(`http://localhost:4000/api/auth/update-user/${id}`,
        { name, businessName, businessRegNo, address, email, phone });

      if (response.data.success) {
        console.log('Updated successfully');
        fetchUserProfileData();
        setModalShow(false);
      } else {
        console.log('Error');
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div className="emp-profile-container">
        <div className="emp-profile-sidebar">
          <SideNavBar role={'Exporter'} />
        </div>
        <div className="emp-profile-content">
          <div className="emp-profile-card-container">
            <Card className="emp-profile-card">
              <Card.Body className="emp-profile-card-header">
                <Card.Title className="emp-profile-title">My Profile</Card.Title>
                <div className="emp-profile-avatar">
                  <span className="emp-profile-avatar-initial">{name.charAt(0)}</span>
                </div>
              </Card.Body>
              <ListGroup className="emp-profile-details">
                <ListGroup.Item className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">Full Name:</span>
                  <span className="emp-profile-detail-value">{name}</span>
                </ListGroup.Item>
                <ListGroup.Item className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">Email:</span>
                  <span className="emp-profile-detail-value">{email}</span>
                </ListGroup.Item>
                <ListGroup.Item className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">Business Name:</span>
                  <span className="emp-profile-detail-value">{businessName}</span>
                </ListGroup.Item>
                <ListGroup.Item className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">Business RegNo:</span>
                  <span className="emp-profile-detail-value">{businessRegNo}</span>
                </ListGroup.Item>
                <ListGroup.Item className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">Contact No:</span>
                  <span className="emp-profile-detail-value">{phone}</span>
                </ListGroup.Item>
                <ListGroup.Item className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">Address:</span>
                  <span className="emp-profile-detail-value">{address}</span>
                </ListGroup.Item>
              </ListGroup>
              <Card.Body className="emp-profile-actions">
                <Button className="emp-profile-edit-btn" onClick={() => { setModalShow(true) }}>
                  Edit Profile
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
        <Modal show={modalShow} onHide={() => { setModalShow(false) }} centered className="emp-profile-modal">
          <Modal.Header closeButton className="emp-profile-modal-header">
            <Modal.Title className="emp-profile-modal-title" onClick={fetchUserProfileData}>Edit Profile Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="emp-profile-modal-body">
            <Form className="emp-profile-form">
              <Form.Group className="emp-profile-form-group">
                <Form.Label className="emp-profile-form-label">Full Name</Form.Label>
                <Form.Control type='text' value={name} onChange={(e) => { setName(e.target.value) }} className="emp-profile-form-input" />
              </Form.Group>
              <Form.Group className="emp-profile-form-group">
                <Form.Label className="emp-profile-form-label">Email</Form.Label>
                <Form.Control value={email} onChange={(e) => { setemail(e.target.value) }} className="emp-profile-form-input" />
              </Form.Group>
              <Form.Group className="emp-profile-form-group">
                <Form.Label className="emp-profile-form-label">Business Name</Form.Label>
                <Form.Control value={businessName} onChange={(e) => { setbusinessName(e.target.value) }} className="emp-profile-form-input" />
              </Form.Group>
              <Form.Group className="emp-profile-form-group">
                <Form.Label className="emp-profile-form-label">Business RegNo</Form.Label>
                <Form.Control value={businessRegNo} onChange={(e) => { setbusinessRegNo(e.target.value) }} className="emp-profile-form-input" />
              </Form.Group>
              <Form.Group className="emp-profile-form-group">
                <Form.Label className="emp-profile-form-label">Phone Number</Form.Label>
                <Form.Control type='number' value={phone} onChange={(e) => { setphone(e.target.value) }} className="emp-profile-form-input" />
              </Form.Group>
              <Form.Group className="emp-profile-form-group">
                <Form.Label className="emp-profile-form-label">Address</Form.Label>
                <Form.Control type='text' value={address} onChange={(e) => { setaddress(e.target.value) }} className="emp-profile-form-input" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="emp-profile-modal-footer">
            <Button variant="secondary" className="emp-profile-modal-cancel" onClick={() => { setModalShow(false) }}>
              Cancel
            </Button>
            <Button className="emp-profile-modal-update" onClick={updateUser}>
              Update Profile
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default ViewUserProfile