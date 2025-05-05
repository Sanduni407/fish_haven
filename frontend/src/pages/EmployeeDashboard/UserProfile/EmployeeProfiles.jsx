import React, { useContext, useEffect, useState } from 'react'
import './EmployeeProfiles.css'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { AppContext } from '../../../context/AppContext';
import SideNavBar from '../../../components/SideNavBar/SideNavBar';

const EmployeeProfiles = () => {
    const {token} = useContext(AppContext)
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [modalShow, setModalShow] = useState(false);

    const fetchUserProfileData = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/auth/get-user', {}, {headers: {token}});
            if (response.data.success) {
                const user = response.data.user;
                setId(user._id)
                setName(user.name)
                setEmail(user.email)
                setPhone(user.phone)
                setAddress(user.address)
            } else {
                console.log('Error')
            }
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchUserProfileData()
    }, [])

    const updateUser = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!phoneRegex.test(phone)) {
            alert("Please enter a valid phone number (10 digits).");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:4000/api/auth/update-user/${id}`,
                { name, address, email, phone });
            if (response.data.success) {
                fetchUserProfileData();
                setModalShow(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="emp-profile-container">
            <div className="emp-profile-sidebar">
                <SideNavBar role={'Employer'} />
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
                                <span className="emp-profile-detail-label">Contact No:</span>
                                <span className="emp-profile-detail-value">{phone}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="emp-profile-detail-item">
                                <span className="emp-profile-detail-label">Address:</span>
                                <span className="emp-profile-detail-value">{address}</span>
                            </ListGroup.Item>
                        </ListGroup>
                        <Card.Body className="emp-profile-actions">
                            <Button 
                                className="emp-profile-edit-btn"
                                onClick={() => { setModalShow(true) }}
                            >
                                Edit Profile
                            </Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <Modal 
                show={modalShow} 
                onHide={() => { setModalShow(false) }} 
                centered
                className="emp-profile-modal"
            >
                <Modal.Header closeButton className="emp-profile-modal-header">
                    <Modal.Title className="emp-profile-modal-title">Edit Profile Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="emp-profile-modal-body">
                    <Form className="emp-profile-form">
                        <Form.Group className="emp-profile-form-group">
                            <Form.Label className="emp-profile-form-label">Full Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={name} 
                                onChange={(e) => { setName(e.target.value) }}
                                className="emp-profile-form-input"
                            />
                        </Form.Group>
                        <Form.Group className="emp-profile-form-group">
                            <Form.Label className="emp-profile-form-label">Email</Form.Label>
                            <Form.Control 
                                value={email} 
                                onChange={(e) => { setEmail(e.target.value) }}
                                className="emp-profile-form-input"
                            />
                        </Form.Group>
                        <Form.Group className="emp-profile-form-group">
                            <Form.Label className="emp-profile-form-label">Phone Number</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={phone} 
                                onChange={(e) => { setPhone(e.target.value) }}
                                className="emp-profile-form-input"
                            />
                        </Form.Group>
                        <Form.Group className="emp-profile-form-group">
                            <Form.Label className="emp-profile-form-label">Address</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={address} 
                                onChange={(e) => { setAddress(e.target.value) }}
                                className="emp-profile-form-input"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="emp-profile-modal-footer">
                    <Button 
                        variant="secondary" 
                        className="emp-profile-modal-cancel"
                        onClick={() => { setModalShow(false) }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        className="emp-profile-modal-update"
                        onClick={updateUser}
                    >
                        Update Profile
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EmployeeProfiles