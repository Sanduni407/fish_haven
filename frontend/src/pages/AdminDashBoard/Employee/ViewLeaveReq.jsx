import React, { useEffect, useState } from 'react'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import axios from 'axios'
import Button from 'react-bootstrap/Button';

const ViewLeaveReq = () => {

    const[requests, setRequests] = useState([])

    const[status, setStatus] = useState('')

    const fetchAllRequests = async()=>{
        try{
           const response = await axios.get(`http://localhost:4000/api/employee/get-all-requests`)

           if(response.data.success)
           {
            setRequests(response.data.requests)
           }
        }catch(err)
        { 
           
            console.log(err)
        }
    }

    const updateStatus = async(id)=>{
        try{

            const response = await axios.put(`http://localhost:4000/api/employee/update-status/${id}`,{status})
            
            if(response.data.success)
            {
                console.log('updated successfully')
                fetchAllRequests()
            }

        }catch(err)
        {
            console.log(err)
        }
    }

    useEffect(()=>{
        fetchAllRequests()
    },[])
  return (
    <div className="view-all-leave-container">
  <div className="left-column">
     <SideNavBar role={"Admin"} />
  </div>
  <div className="right-column">

  <table className="admin-order-table" style={{marginLeft:'300px', width:'1100px'}} >
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
                     
             
              <th> </th>
            </tr>
          </thead>
          <tbody>
          {requests.map((request,index)=>{
                      return(
                         <tr key={index}>
                       <td>#{index}</td>
                      <td>{request.name}</td>
                      <td>{request.section}</td>
                      <td>{request.leaveType}</td>
                      <td>{request.startDate}</td>
                      <td>{request.endDate}</td>
                      <td>{request.reason}</td>
                      <td> <select placeholder="LeaveType" value={request.status} style={{width:'200px'}} onChange={(e)=>{setStatus(e.target.value)}}>
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                         </select></td>
                          <td> <Button variant="success"  onClick={()=>{updateStatus(request._id)}}>Update</Button></td>
                    </tr>
                     
                      )
                    })}
           
          </tbody>
        </table>
      
    </div>
  </div>

 


  )
}

export default ViewLeaveReq
