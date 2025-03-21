import React, { useEffect, useState } from 'react'
import './ViewUserAccounts.css'
import axios, { Axios } from 'axios'
import SideNavBar from '../../../components/SideNavBar/SideNavBar';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const ViewUserAccounts = () => {

   const navigate = useNavigate()

    const[userAccounts, setUserAccounts] = useState([]);

    const getalluseraccounts = async()=>{

        try{
            const response = await axios.get('http://localhost:4000/api/auth/get')

            if(response.data.success)
            {
                setUserAccounts(response.data.users)
            }
        }
    catch(err)
    {
        console.log(err)
    }
     }

     useEffect(()=>{

        getalluseraccounts()
     },[])

     const deleteAccount = async(id)=>{
      try{

        const response = await axios.delete(`http://localhost:4000/api/auth/delete-user/${id}`) 

        if(response.data.success)
        {
          console.log('deleted successfully')
          toast.success('Deleted successfully')
          getalluseraccounts()
        }

      }catch(err){

        console.log(err)
        toast.error('Error')

      }
     }

  return (
    <>
    <div className='main'>

    <SideNavBar role={"Admin"}/>

    <div className="exporter-table-container">

        <br/><br/>
        <button className='btn-btn' style={{backgroundColor:'#007074'}} onClick={()=>{navigate('/create-acc')}}>Create new account</button>
        <button className='btn-btn' style={{backgroundColor:'#1d3557'}} onClick={()=>{navigate('/view-requests')}}>View Exporter requests</button>
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
          <th>Role</th>
          <th> </th>
             
              
            </tr>
          </thead>
          <tbody>
          {userAccounts.map((row,index) => (
          <tr key={index}>
            
            <td>{row.name}</td>
            <td>{row.businessName}</td>
            <td>{row.businessRegNo}</td>
            <td>{row.email}</td>
            <td>{row.phone}</td>
            <td>{row.role}</td>
            <td> <Button variant="danger" onClick={()=>{deleteAccount(row._id)}}>Remove account</Button></td>
          </tr>
        ))}
           
          </tbody>
        </table>
      
    </div>
   
  </div></div>
  </>
  )
}

export default ViewUserAccounts