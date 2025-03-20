import React, { useContext, useState } from 'react'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddLeave = () => {

  const{token} = useContext(AppContext)

  const[name,setname] = useState('');
  const[leaveType,setleaveType] = useState('');
  const[section,setsection] = useState('');
  const[endDate,setendDate] = useState('');
  const[startDate,setstartDate] = useState('');
  const[reason,setreason] = useState('');

  const RequestLeave = async()=>{
     
    try{

      const response = await axios.post('http://localhost:4000/api/employee/create-leave',{
        name, section, leaveType, startDate,endDate,reason
      },{headers:{token}});

      if(response.data.success)
      {
        toast.success('leave request is submitted successfully')    
        console.log(response.data)

        setname('')
        setsection('')
        setleaveType('')
        setstartDate('')
        setendDate('')
        setreason('')
      }
      else
      {
        toast.error('Error')
      }

    }catch(err)
    {
      console.log(err);
    }
  }


  return (
    <div className="add-leave-container">
  <div className="left-column">
    <SideNavBar role={"Employer"} />
  </div>

  <div className="right-column">

  <Form style={{marginLeft:'270px'}}>
      <Row>
      <Col>
          <Form.Control placeholder='Name' onChange={(e)=>{setname(e.target.value)}} />
        </Col>
        <Col>
          <Form.Select placeholder="Department" onChange={(e)=>{setsection(e.target.value)}} >
          <option>Select Section</option>
         <option value="Quality Control">Quality Control</option>
         <option value="Maintenance">Maintenance</option>
         <option value="Customer Care">Customer Care</option>
         <option value="Export and Logistics">Export and Logistics</option>
            </Form.Select>
          
        </Col>

        <Col>
          <Form.Select placeholder="LeaveType"  onChange={(e)=>{setleaveType(e.target.value)}} >
          <option>Select Leave Type</option>
         <option value="Medical">Medical</option>
         <option value="Vacation">Vacation</option>
         <option value="Emergency">Emergency</option>
        </Form.Select>
          
        </Col>
      </Row>
      <Row>
      <Col>
          <Form.Control placeholder="Start Date" type="date" onChange={(e)=>{setstartDate(e.target.value)}}/>
        </Col>
      
      <Col>
          <Form.Control placeholder="End Date" type="date" onChange={(e)=>{setendDate(e.target.value)}}/>
        </Col> 
      </Row>

      <Row>
         <Col>
         <Form.Control as="textarea"  placeholder='Type the reason..' rows={3} onChange={(e)=>{setreason(e.target.value)}} />
        </Col>
      </Row>

    </Form>

   <center> <Button variant="dark" style={{width:'300px', marginLeft:'90px', marginTop:'30px'}} onClick={RequestLeave}>Request Leave</Button></center>

  </div>
</div>
  )
}

export default AddLeave
