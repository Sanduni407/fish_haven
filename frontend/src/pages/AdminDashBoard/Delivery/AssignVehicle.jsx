import React, { useEffect, useState } from 'react'
import './AssignVehicle.css'
import { useParams } from 'react-router-dom'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SideNavBar from '../../../components/SideNavBar/SideNavBar';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';


const AssignVehicle = () => {
     
    const{id} = useParams()

    const [userId, setUserId] = useState("");
    const [date, setDate] = useState("");
    const [vehicle, setvehicle] = useState("");
    const [time, setTime] = useState("");
    const [ delCode, setdelCode] = useState("");
    const [status , setStatus] = useState('')

    const [searchDate, setSearchDate] = useState("");

    const [selectedId, setselectedId] = useState('')

     const [modalShow, setModalShow] = useState(false);

    

    const [asignedVehicles, setAssignedVehicles] = useState([])

    const fetchData = async()=>{
        try{

            const response = await axios.get(`http://localhost:4000/api/delivery/fetch-a-delivery/${id}`);
      
            if(response.data.success)
            {
              const delivery = response.data.deliveryRecord;
                setUserId(delivery.userId)
                setdelCode(delivery.delCode)
                setDate(delivery.deliveryDate)

            }

        }catch(err)
        {
            console.log(err)
        }
    }

    const AsssignAvehicle = async()=>{
        try{

            const response = await axios.post(`http://localhost:4000/api/delivery/assign-a-vehicle`,{userId,date,vehicle,time,delCode});
      
            if(response.data.success)
            {
             console.log("vehicle is assigned successfully")
             toast.success('successfully assigned')
             getAllDetails()
            }

        }catch(err)
        {
            console.log(err)
        }
    }

    const getAllDetails = async()=>{

        try{

            const response = await axios.get(`http://localhost:4000/api/delivery/get-all-vehicle?searchText=${searchDate}`);
      
            if(response.data.success)
            {
                setAssignedVehicles(response.data.assignVehicles)
            }

        }catch(err)
        {
            console.log(err)
        }
    }

    useEffect(()=>{
        fetchData();
        getAllDetails();
    },[])


    useEffect(()=>{
     
      getAllDetails()
  },[searchDate])

const fetchAssignedData= async(id)=>{
    try{

        const response = await axios.get(`http://localhost:4000/api/delivery/get-vehicle/${id}`);
  
        if(response.data.success)
        {
          const vehicle = response.data.vehicleRecode;
            setDate(vehicle.date)
            setStatus(vehicle.status)
            setTime(vehicle.time)
            setvehicle(vehicle.vehicle)
            setdelCode(vehicle.delCode)
            setselectedId(vehicle._id)
        }

    }catch(err)
    {
        console.log(err)
    }
}


const update = async()=>{
    try{

        const response = await axios.put(`http://localhost:4000/api/delivery/update-assign-vehicle/${selectedId}`,{vehicle,time,status});
  
        if(response.data.success)
        {
            console.log('updated successfully')
            toast.success('Vehicle details changed successfully')
            getAllDetails()
            setModalShow(false);

        }

    }catch(err)
    {
        console.log(err)
    }
}

const Delete = async()=>{
    try{

        const response = await axios.delete(`http://localhost:4000/api/delivery/delete-vehicle/${selectedId}`);
  
        if(response.data.success)
        {
            console.log('successfully deleted')
            toast.success('Record removed successfully')
            getAllDetails()
          

        }

    }catch(err)
    {
        console.log(err)
    }
}

  return (
    <div className="assign-vehicle-container">
  <div className="left-column">
    <SideNavBar role="Admin" />
  </div>
  <div className="right-column">
    <br/>
  <Form>
      <Row>
      <Col>
          <label>Delivery Code</label><br/>
          <Form.Control placeholder='delivery code' value={delCode} readOnly />
        </Col>
        <Col>
          <label>Shippment Date</label><br/>
          <Form.Control placeholder='Shippment date' value={date} readOnly/>
        </Col>

        <Col>
          <label>Vehicle No</label><br/>
          <Form.Select placeholder="vehicle No"  onChange={(e)=>{setvehicle(e.target.value)}}required>
              <option>Assign a vehicle</option>
              <option value="CXX-2316" >CXX-2316</option>
              <option value="DBR-2456" >DBR-2456</option>
              <option value="CAA-1516" >CAA-1516</option>
              <option value="KA-2342" >KA-2342</option>
              <option value="CAZ-1003" >CAZ-1003</option>
            
            </Form.Select>
          
        </Col>

        <Col>
          <label>Time</label><br/>
          <Form.Control placeholder="time"  type="time"  value={time}  onChange={(e)=>{setTime(e.target.value)}}/>
        </Col>
   
      </Row>
    </Form><br/>

       <center><Button variant="secondary" onClick={AsssignAvehicle} style={{width:'200px'}}>Assign Vehicle</Button></center> 

      <center> <Form> <Row> <Col>
          <Form.Control placeholder='Search here'  onChange={(e)=>{setSearchDate(e.target.value)}} type='date' style={{width:'500px', marginTop:'30px',marginLeft:'200px'}}/>
        </Col>
        </Row></Form></center>
       
       
       
       <div className="table-style">
      <table>
      <thead>
        <tr>
          <th>Delivery Code</th>
          <th>Vehicle</th>
          <th>Date</th>
          <th>Time</th>
          <th>Delivery Status</th>
          <th>Update</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>

        {asignedVehicles.map((item,index)=>{
          return(
          <tr key={index}>
          <td>{item.delCode}</td>
          <td>{item.vehicle}</td>
          <td>{item.date}</td>
          <td>{item.time}</td>
          <td>{item.status}</td>
          <td><button className='btndelete' onClick={()=>{ setselectedId(item._id); fetchAssignedData(item._id); setModalShow(true);}}  style={{backgroundColor:'#ACE1AF'}}>Update</button></td>
          <td><button className='btndelete'  onClick={()=>{setselectedId(item._id); Delete()}}>Delete</button></td>
        </tr>)
        })}
        
      </tbody>
      </table>
        


    </div>
  </div>

  <Modal show={modalShow} onHide={()=>{setModalShow(false)}} centered>
      <Modal.Header closeButton>
        <Modal.Title>Vehicle Assign Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
      <Row>
      <Col>
          <label>Delivery Code</label><br/>
          <Form.Control placeholder='delivery code' value={delCode} readOnly />
        </Col>
        <Col>
          <label>Shippment Date</label><br/>
          <Form.Control placeholder='Shippment date' value={date} readOnly/>
        </Col>
      </Row>
      <Row>
        <Col>
          <label>Vehicle No</label><br/>
          <Form.Select placeholder="vehicle No" value={vehicle}  onChange={(e)=>{setvehicle(e.target.value)}}>
              <option>Assign a vehicle</option>
              <option value="CXX-2316" >CXX-2316</option>
              <option value="DBR-2456" >DBR-2456</option>
              <option value="CAA-1516" >CAA-1516</option>
              <option value="KA-2342" >KA-2342</option>
              <option value="CAZ-1003" >CAZ-1003</option>
            
            </Form.Select>
          
        </Col>

        <Col>
          <label>Time</label><br/>
          <Form.Control placeholder="time"  type="time"  value={time}  onChange={(e)=>{setTime(e.target.value)}}/>
        </Col>
     
        <Col>
        <label>Status</label><br/>
        <Form.Select placeholder="status" value={status}  onChange={(e)=>{setStatus(e.target.value)}}>
              <option></option>
              <option value="Assigned" >Assigned</option>
              <option value="Out-for-delivery" >Out-for-delivery</option>
              <option value="Delivered" >Delivered</option> 
            </Form.Select>
       </Col>
      </Row>
    </Form>
      </Modal.Body>
      <Modal.Footer>
    <Button variant="secondary" style={{backgroundColor:'#006A4E'}} onClick={update}>
          Update
        </Button>
        <Button variant="secondary" onClick={()=> setModalShow(false)}>
          Close
        </Button>

      </Modal.Footer>
    </Modal>

</div>

  )
}

export default AssignVehicle