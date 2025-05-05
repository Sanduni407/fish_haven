import React, { useEffect, useState } from 'react'
import './ViewLeaveReq.css'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import axios from 'axios'
import { Table, Form, Button } from 'react-bootstrap'
import { assets } from '../../../assets/assets'

const ViewLeaveReq = () => {
    const [requests, setRequests] = useState([])
    const [status, setStatus] = useState('')

    const fetchAllRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/employee/get-all-requests`)
            if (response.data.success) {
                setRequests(response.data.requests)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const updateStatus = async (id) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/employee/update-status/${id}`, { status })
            if (response.data.success) {
                console.log('updated successfully')
                fetchAllRequests()
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchAllRequests()
    }, [])

    return (
        <div className="admin-view-leave-req-container">
            <SideNavBar role="Admin" />
            <div className="admin-view-leave-req-content">
                <h2 className="admin-view-leave-req-title">Manage Leave Requests</h2>
                <div className="admin-view-leave-req-table-container">
                    <Table className="admin-view-leave-req-table">
                        <thead>
                            <tr>
                                <th className="admin-view-leave-req-th-request-no">Request No</th>
                                <th className="admin-view-leave-req-th-name">Name</th>
                                <th className="admin-view-leave-req-th-section">Section</th>
                                <th className="admin-view-leave-req-th-leave-type">Leave Type</th>
                                <th className="admin-view-leave-req-th-start-date">Start Date</th>
                                <th className="admin-view-leave-req-th-end-date">End Date</th>
                                <th className="admin-view-leave-req-th-reason">Reason</th>
                                <th className="admin-view-leave-req-th-status">Approval Status</th>
                                <th className="admin-view-leave-req-th-update">Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request, index) => (
                                <tr key={index}>
                                    <td>#{index}</td>
                                    <td>{request.name}</td>
                                    <td>{request.section}</td>
                                    <td>{request.leaveType}</td>
                                    <td>{request.startDate}</td>
                                    <td>{request.endDate}</td>
                                    <td>{request.reason}</td>
                                    <td>
                                        <Form.Select
                                            className="admin-view-leave-req-status-select"
                                            value={request.status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Button
                                            className="admin-view-leave-req-update-button"
                                            onClick={() => updateStatus(request._id)}
                                        >
                                            Update
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default ViewLeaveReq