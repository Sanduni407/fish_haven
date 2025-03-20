import React, { useContext, useEffect, useState } from 'react'
import './ViewRequest.css'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import { AppContext } from '../../../context/AppContext'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const ViewRequest = () => {

    const {token} = useContext(AppContext)

    const[Request,setRequests] = useState([])

      const[name,setname] = useState('');
      const[leaveType,setleaveType] = useState('');
      const[section,setsection] = useState('');
      const[endDate,setendDate] = useState('');
      const[startDate,setstartDate] = useState('');
      const[reason,setreason] = useState('');

      const [modalShow, setModalShow] = useState(false);

      const [id,setSelectedId] = useState();

    const fetchAllRequests = async()=>{

        try{
    
          const response = await axios.post('http://localhost:4000/api/employee/get-requests-byuser',{},{headers:{token}});
    
          if(response.data.success)
          {
            setRequests(response.data.requests)
           
          }
    
        }catch(err)
        {
          console.log(err)
        }
      }

      const fetchaRequest = async(id)=>{
        try{
            
            const response = await axios.post('http://localhost:4000/api/employee/fetch-a-request',{id});
            if(response.data.success)
                {
                  const request = response.data.request;

                  setname(request.name)
                  setsection(request.section)
                  setleaveType(request.leaveType)
                  setendDate(request.endDate)
                  setstartDate(request.startDate)
                   setreason(request.reason)
                }

        }catch(err){
          
            console.log(err)
        }
      }

      useEffect(()=>{
        fetchAllRequests()
      },[])


      const updateRequest = async()=>{

        try{
          
           const response = await axios.put(`http://localhost:4000/api/employee/update-request/${id}`,{
            name, section, leaveType, startDate,endDate,reason
           })

           if(response.data.success)
           {
               console.log("request updated successfully")
               fetchAllRequests();
               setModalShow(false)
              
           }
        }catch(err)
        {
           console.log(err)
        }
     }

     const deleteRequest = async(id)=>{

        try{
          
           const response = await axios.delete(`http://localhost:4000/api/employee/delete-a-request/${id}`)

           if(response.data.success)
           {
               console.log("request deleted successfully")
               fetchAllRequests();
               
              
           }
        }catch(err)
        {
           console.log(err)
        }
     }

    
  return (
    <div className=" view-leave-request-container">
    <div className="left-column">
        <SideNavBar role={"Employer"}/>
    </div>
    <div className="right-column">
         <div>
        
        <table className="admin-order-table" >
                  <thead>
                    <tr>
                    
                      <th>Request No</th>
                      <th>Name</th>
                      <th>Section</th>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Reason</th>
                      <th>Approval Status</th>
                      <th>Update</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Request.map((request,index)=>{
                      return(
                         <tr key={index}>
                       <td>#{index}</td>
                      <td>{request.name}</td>
                      <td>{request.section}</td>
                      <td>{request.leaveType}</td>
                      <td>{request.startDate}</td>
                      <td>{request.endDate}</td>
                      <td>{request.reason}</td>
                      <td>{request.status}</td> 
                      <td><Button variant="success" onClick={()=>{ setSelectedId(request._id);fetchaRequest(request._id);setModalShow(true)}}>Update</Button></td>
                      <td> <Button variant="danger" onClick={()=>{deleteRequest(request._id)}}>Remove</Button></td>
                    </tr>
                      )
                    })}
                   
                  </tbody>
                </table>
              
            </div>
    </div>

    <Modal show={modalShow} onHide={()=>{setModalShow(false)}} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Leave Request Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form >
      <Row>
      <Col>
          <Form.Control placeholder='Name' value={name} onChange={(e)=>{setname(e.target.value)}} />
        </Col>
        <Col>
          <Form.Select placeholder="Department" value={section} onChange={(e)=>{setsection(e.target.value)}} >
          <option>Select Section</option>
         <option value="Quality Control">Quality Control</option>
         <option value="Maintenance">Maintenance</option>
         <option value="Customer Care">Customer Care</option>
         <option value="Export and Logistics">Export and Logistics</option>
            </Form.Select>
          
        </Col>

        <Col>
          <Form.Select placeholder="LeaveType"   value={leaveType}  onChange={(e)=>{setleaveType(e.target.value)}} >
          <option>Select Leave Type</option>
         <option value="Medical">Medical</option>
         <option value="Vacation">Vacation</option>
         <option value="Emergency">Emergency</option>
        </Form.Select>
          
        </Col>
      </Row>
      <Row>
      <Col>
          <Form.Control placeholder="Start Date" type="date" value={startDate} onChange={(e)=>{setstartDate(e.target.value)}}/>
        </Col>
      
      <Col>
          <Form.Control placeholder="End Date" type="date" value={endDate} onChange={(e)=>{setendDate(e.target.value)}}/>
        </Col> 
      </Row>

      <Row>
         <Col>
         <Form.Control as="textarea"  placeholder='Type the reason..' value={reason} rows={3} onChange={(e)=>{setreason(e.target.value)}} />
        </Col>
      </Row>

    </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={updateRequest}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
  
  )
}

export default ViewRequest
