import React, { useContext, useEffect, useState } from 'react'
import './ViewRequest.css'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import { AppContext } from '../../../context/AppContext'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import {assets} from '../../../assets/assets'

const ViewRequest = () => {
  const { token } = useContext(AppContext)

  const [Request, setRequests] = useState([])
  const [name, setname] = useState('')
  const [leaveType, setleaveType] = useState('')
  const [section, setsection] = useState('')
  const [endDate, setendDate] = useState('')
  const [startDate, setstartDate] = useState('')
  const [reason, setreason] = useState('')
  const [modalShow, setModalShow] = useState(false)
  const [id, setSelectedId] = useState()

  const fetchAllRequests = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/employee/get-requests-byuser', {}, { headers: { token } })
      if (response.data.success) {
        setRequests(response.data.requests)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchaRequest = async (id) => {
    try {
      const response = await axios.post('http://localhost:4000/api/employee/fetch-a-request', { id })
      if (response.data.success) {
        const request = response.data.request
        setname(request.name)
        setsection(request.section)
        setleaveType(request.leaveType)
        setendDate(request.endDate)
        setstartDate(request.startDate)
        setreason(request.reason)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAllRequests()
  }, [])

  const updateRequest = async () => {
    try {
      const response = await axios.put(`http://localhost:4000/api/employee/update-request/${id}`, {
        name, section, leaveType, startDate, endDate, reason
      })
      if (response.data.success) {
        console.log("request updated successfully")
        fetchAllRequests()
        setModalShow(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteRequest = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/employee/delete-a-request/${id}`)
      if (response.data.success) {
        console.log("request deleted successfully")
        fetchAllRequests()
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="employee-view-leave-requests-container">
      <SideNavBar role="Employer" />
      <div className="employee-view-leave-requests-content">
        <h2 className="employee-view-leave-requests-title">Leave Requests</h2>
        <div className="employee-view-leave-requests-table-container">
          {Request.length === 0 ? (
            <p className="employee-view-leave-requests-no-results">No leave requests found.</p>
          ) : (
            <table className="employee-view-leave-requests-table">
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
                {Request.map((request, index) => (
                  <tr key={index}>
                    <td>#{index + 1}</td>
                    <td>{request.name}</td>
                    <td>{request.section}</td>
                    <td>{request.leaveType}</td>
                    <td>{request.startDate}</td>
                    <td>{request.endDate}</td>
                    <td>{request.reason}</td>
                    <td>{request.status}</td>
                    <td>
                      <button
                        className="employee-view-leave-requests-update-button"
                        onClick={() => {
                          setSelectedId(request._id)
                          fetchaRequest(request._id)
                          setModalShow(true)
                        }}
                      >
                        <img src={assets.editimg} alt="edit" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="employee-view-leave-requests-remove-button"
                        onClick={() => deleteRequest(request._id)}
                      >
                        <img src={assets.deleteimg} alt="delete" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="employee-view-leave-requests-modal-title">
              Update Leave Request Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="employee-view-leave-requests-modal-row">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="employee-view-leave-requests-modal-label">Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      className="employee-view-leave-requests-modal-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="employee-view-leave-requests-modal-label">Department</Form.Label>
                    <Form.Select
                      value={section}
                      onChange={(e) => setsection(e.target.value)}
                      className="employee-view-leave-requests-modal-select"
                    >
                      <option value="">Select Section</option>
                      <option value="Quality Control">Quality Control</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Customer Care">Customer Care</option>
                      <option value="Export and Logistics">Export and Logistics</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="employee-view-leave-requests-modal-label">Leave Type</Form.Label>
                    <Form.Select
                      value={leaveType}
                      onChange={(e) => setleaveType(e.target.value)}
                      className="employee-view-leave-requests-modal-select"
                    >
                      <option value="">Select Leave Type</option>
                      <option value="Medical">Medical</option>
                      <option value="Vacation">Vacation</option>
                      <option value="Emergency">Emergency</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="employee-view-leave-requests-modal-row">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="employee-view-leave-requests-modal-label">Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setstartDate(e.target.value)}
                      className="employee-view-leave-requests-modal-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="employee-view-leave-requests-modal-label">End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setendDate(e.target.value)}
                      className="employee-view-leave-requests-modal-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="employee-view-leave-requests-modal-row">
                <Col>
                  <Form.Group>
                    <Form.Label className="employee-view-leave-requests-modal-label">Reason</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Type the reason"
                      value={reason}
                      rows={4}
                      onChange={(e) => setreason(e.target.value)}
                      className="employee-view-leave-requests-modal-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="employee-view-leave-requests-modal-update-button"
              onClick={updateRequest}
            >
              Update
            </Button>
            <Button
              className="employee-view-leave-requests-modal-close-button"
              onClick={() => setModalShow(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default ViewRequest