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

// View emp User Profile

const EmployeeProfiles = () => {
    const {token} = useContext(AppContext)

    const[id,setId] = useState('')
    const[name,setName] = useState('')
    const[  email,setemail] = useState('')
    const[ phone,setphone] = useState('')
    const[ address,setaddress] = useState('')

    const [modalShow, setModalShow] = useState(false);


    const fetchUserProfileData = async()=>{
     
        try{
    
          const response = await axios.post('http://localhost:4000/api/auth/get-user',{},{headers:{token}});
    
          if(response.data.success)
          {
            console.log(response.data.user)
           
            const user = response.data.user;
            setId(user._id)
            setName(user.name)
            setemail(user.email)
            setphone(user.phone)
            setaddress(user.address)
          }
          else
          {
            console.log('Error')
          }
    
        }catch(err)
        {
          console.log(err);
        }
      }

      useEffect(()=>{
        fetchUserProfileData()
      },[])

// Update emp user details

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
                { name, address, email, phone });
    
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

   <div className="view-user-profile-container">
      <div className="left-column">
       <SideNavBar role={'Employer'} />
      </div>
   <div className="right-column">

   <Card style={{ width: '40rem' ,marginTop:'50px' , backgroundColor: '#f8f9fa'}} >
      <Card.Body>
        <Card.Title>My Profile</Card.Title>
        <Card.Text>
          
        </Card.Text>
      </Card.Body >
      <ListGroup className="list-group-flush" >
        <ListGroup.Item style={{ backgroundColor: '#f8f9fa'}}><span style={{color:'#49557e', fontWeight:'bold',marginRight:'10px'}}>Full Name :</span> {name}</ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#f8f9fa'}}> <span style={{color:'#49557e', fontWeight:'bold',marginRight:'10px'}}>Email : </span>{email} </ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#f8f9fa'}}><span style={{color:'#49557e', fontWeight:'bold',marginRight:'10px'}}>Contact No :</span> {phone}</ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#f8f9fa'}}><span style={{color:'#49557e', fontWeight:'bold',marginRight:'10px'}}>Address :</span> {address} </ListGroup.Item>    
      </ListGroup>
      <Card.Body>
      <Button  style={{width:'130px', backgroundColor:'#49557e', color:'white',border:'none'}} onClick={()=>{setModalShow(true)}}>Edit Profile</Button>
      </Card.Body>
    </Card>

   </div>
   </div>


   <Modal show={modalShow} onHide={()=>{setModalShow(false)}} centered>
          <Modal.Header closeButton>
            <Modal.Title style={{color:'#49557e'}} onClick={ fetchUserProfileData}>Edit Profile Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form style={{marginTop:'30px'}}>
        <Row>
        <Col>
            <Form.Control type='text' value={name} onChange={(e)=>{setName(e.target.value)}} />
          </Col>
          </Row>

          <Row>
  
          <Col>
           
          <Form.Control value={email} onChange={(e)=>{setemail(e.target.value)}} />
          </Col>
          </Row>
          <Row>
        <Col>
            <Form.Control type='Number' value={phone} onChange={(e)=>{setphone(e.target.value)}}  />
          </Col>  
          </Row>
          <Row>
          <Col>
            <Form.Control type='text' value={address} onChange={(e)=>{setaddress(e.target.value)}}   />
          </Col>  
        </Row>
      </Form>  
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" style={{backgroundColor:'#49557e', color:'white', width:"200px"}} onClick={updateUser}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
  
      
    </div>

    
  )
}

export default EmployeeProfiles
