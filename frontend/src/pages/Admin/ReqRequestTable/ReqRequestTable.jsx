import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SideNavBar from '../../../components/SideNavBar/SideNavBar';
import axios from 'axios';

const ReqRequestTable = () => {

    const navigate = useNavigate();


    const[requests, setRequest] = useState([])

       const getallexporterRequests = async()=>{
    
            try{
                const response = await axios.get('http://localhost:4000/api/reg-request/get-all-requests')
    
                if(response.data.success)
                {
                    setRequest(response.data.requests)
                }
            }
        catch(err)
        {
            console.log(err)
        }
         }
    
         useEffect(()=>{
    
            getallexporterRequests()

         },[])
    


  return (
    <div className='main'>
    <SideNavBar role={"Admin"}/>
    <div className="exporter-table-container">
       
       
        <br/><br/>

        
        <div>

<table className="admin-order-table" >
          <thead>
            <tr>
            
            <th>Name</th>
            <th>Business Name</th>
            <th>Registration No</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th> </th>
             
              
            </tr>
          </thead>
          <tbody>
          {requests.map((row,index) => (
          <tr key={index}>
            
            <td>{row.name}</td>
            <td>{row.businessName}</td>
            <td>{row.businessRegNo}</td>
            <td>{row.email}</td>
            <td>{row.phone}</td>
            <td>{row.address}</td>
            <td><button style={{backgroundColor:"#007074", color:"white"}} onClick={()=>{navigate(`/create-acc/${row._id}`)}}>Create account</button></td>
          </tr>
        ))}
           
          </tbody>
        </table>
      
    </div>
 
  </div>
  </div>
  )
}

export default ReqRequestTable