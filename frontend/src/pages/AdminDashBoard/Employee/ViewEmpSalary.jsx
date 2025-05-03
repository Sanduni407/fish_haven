import React, { useEffect, useState } from 'react'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import axios from 'axios';
import { Table, Form, Button, Toast } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Row';

const ViewEmpSalary = () => {

    const[employee, setEmployee] = useState([]);

    const[name, setName] = useState('');
    const[basicPay, setbasicPay] = useState(0);
    const[presentDays, setpresentDays] = useState(0);
    const[calculatedSalary, setcalculatedSalary] = useState(0);

    const[modalShow,setModalShow] = useState(false);
    const[selectedId, setSelectedId] = useState('')


    const fetchAllData = async()=>{

        try{
            const response = await axios.get(`http://localhost:4000/api/employee/get-all-salary`)
 
            if(response.data.success)
            {
              setEmployee(response.data.employees)
            }
         }catch(err)
         { 
            
             console.log(err)
         }
    }

    const fetchARecord = async()=>{

        try{
            const response = await axios.get(`http://localhost:4000/api/employee/get-salary-record/${selectedId}`)
 
            if(response.data.success)
            {
              const record = response.data.salaryrecord;

              setName(record.name);
              setbasicPay(record.basicPay);
              setpresentDays(record.presentDays);
              setcalculatedSalary(record.calculatedSalary);
            }
         }catch(err)
         { 
            
             console.log(err)
         }
    }


    useEffect(()=>{
        fetchAllData()
    },[])

    useEffect(()=>{
        if(selectedId)
        {
            fetchARecord()
        }
        
    },[selectedId])






    const updateDetails = async()=>{

        try{
            const response = await axios.put(`http://localhost:4000/api/employee/update-salary`,{ id : selectedId, basicPay,presentDays,calculatedSalary})
 
            if(response.data.success)
            {
               console.log("Successfully updated")
               fetchAllData()
               setModalShow(false)
               
            }
         }catch(err)
         { 
            console.log("update details function is not working")
             
         }
    }


    const handleAttendanceChange= async( empId, status)=>{

        try{
            const response = await axios.post(`http://localhost:4000/api/employee/mark-attendance`,{ empId, status})
 
            if(response.data.success)
            {
               console.log("Successfully updated")
               fetchAllData()
               
               
            }
         }catch(err)
         { 
            console.log("update details function is not working")
             
         }
    }



  return (
    <div className="view-all-empSalary-container">

  <div className="left-column">

     <SideNavBar  role={"Admin"} />

  </div>

  <div className="right-column">

  <table className="admin-order-table" style={{marginLeft:'300px', width:'1100px'}} >
          <thead>
            <tr>
            
                     <th>#EmpID</th>
                      <th>Employee Name</th>
                      <th>Basic Pay</th>
                      <th>Present Days</th>
                      <th>Today's Status</th>
                      <th>Calculated Salary</th>
                      <th>Update</th>
                      <th>Generate Slip</th>
                     
             
             
            </tr>
          </thead>
          <tbody>
          {employee.map((request,index)=>{
                      return(
                         <tr key={index}>
                       <td>#{index}</td>
                      <td>{request.name}</td>
                      <td>LKR {request.basicPay}</td>
                      <td>{request.presentDays}</td>
                      <td>

                      <Form.Select
                              value=""
                              onChange={(e) =>{ handleAttendanceChange(request._id, e.target.value)}}>
                             <option value="">Select</option>
                             <option value="Present">Present</option>
                             <option value="Absent">Absent</option>
                    </Form.Select>
                      </td>
                      <td>LKR {request.calculatedSalary}</td>
                      <td> <Button variant="success" onClick={()=>{setSelectedId(request._id); setModalShow(true)}}>Update</Button></td>
                      <td> <Button variant="danger">Generate Slip</Button></td>
                    </tr>
                     
                      )
                    })}
           
          </tbody>
        </table>

    </div>




    <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
  <Modal.Header closeButton style={{ backgroundColor: "#f0f3f4" }}>
    <Modal.Title style={{ fontWeight: "bold", color: "#2c3e50" }}>
      Update Employee Salary Details
    </Modal.Title>
  </Modal.Header>

  <Modal.Body style={{ padding: "25px 30px", backgroundColor: "#fafafa" }}>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label style={{ fontWeight: "500" }}>Employee Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          readOnly
          className="form-control-sm"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ fontWeight: "500" }}>Basic Pay</Form.Label>
        <Form.Control
          type="Number"
          value={basicPay}
          onChange={(e) => setbasicPay(parseFloat(e.target.value))}
          className="form-control-sm"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ fontWeight: "500" }}>Present Days</Form.Label>
        <Form.Control
          type="Number"
          value={presentDays}
          onChange={(e) => setpresentDays(parseFloat(e.target.value))}
          className="form-control-sm"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label style={{ fontWeight: "500" }}>Calculated Salary</Form.Label>
        <Form.Control
          type="Number"
          value={calculatedSalary}
          onChange={ (e) => setcalculatedSalary(parseFloat(e.target.value))}
          className="form-control-sm"
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button
          variant="success"
          style={{
            backgroundColor: "#16a085",
            border: "none",
            fontWeight: "500",
            padding: "6px 16px",
            fontSize: "14px",
            minWidth: "100px"
          }}
          onClick={updateDetails}
        >
          Update
        </Button>
      </div>
    </Form>
  </Modal.Body>
</Modal>


    </div>
  )
}

export default ViewEmpSalary