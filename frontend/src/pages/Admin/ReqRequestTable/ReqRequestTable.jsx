import React, { useEffect, useState } from 'react'
import './ReqRequestTable.css'
import { useNavigate } from 'react-router-dom'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import axios from 'axios'
import { toast } from 'react-toastify';
import {assets} from '../../../assets/assets'

const ReqRequestTable = () => {
  const navigate = useNavigate()
  const [requests, setRequest] = useState([])

  const getallexporterRequests = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/reg-request/get-all-requests')
      if (response.data.success) {
        setRequest(response.data.requests)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteRegisterRequest = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/reg-request/delete-a-request/${id}`)
      if (response.data.success) {
        getallexporterRequests()
        toast.success('Request deleted successfully')
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getallexporterRequests()
  }, [])

  return (
    <div className="admin-register-requests-container">
      <SideNavBar role="Admin" />
      <div className="admin-register-requests-content">
        <h2 className="admin-register-requests-title">Manage Register Requests</h2>
        <div className="admin-register-requests-table-container">
          {requests.length === 0 ? (
            <p className="admin-register-requests-no-results">No register requests found.</p>
          ) : (
            <table className="admin-register-requests-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Business Name</th>
                  <th>Registration No</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {requests.map((row, index) => (
                  <tr key={index}>
                    <td>{row.name}</td>
                    <td>{row.businessName}</td>
                    <td>{row.businessRegNo}</td>
                    <td>{row.email}</td>
                    <td>{row.phone}</td>
                    <td>{row.address}</td>
                    <td>
                      <button
                        className="admin-register-requests-create-account-button"
                        onClick={() => navigate(`/create-acc/${row._id}`)}
                      >
                        Create Account
                      </button>
                    </td>
                    <td>
                      <button
                        className="admin-register-requests-delete-button"
                        onClick={() => {deleteRegisterRequest(row._id)}}
                      >
                        <img src={assets.deleteimg} alt="Delete"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReqRequestTable