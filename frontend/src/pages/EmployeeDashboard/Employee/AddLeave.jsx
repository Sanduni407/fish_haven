import React, { useContext, useState, useEffect } from 'react'
import './AddLeave.css'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { AppContext } from '../../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddLeave = () => {
  const { token } = useContext(AppContext)

  const [name, setname] = useState('')
  const [leaveType, setleaveType] = useState('')
  const [section, setsection] = useState('')
  const [endDate, setendDate] = useState('')
  const [startDate, setstartDate] = useState('')
  const [reason, setreason] = useState('')
  const [minDate, setMinDate] = useState('')
  const [maxEndData, setMaxDate] = useState('')

  useEffect(() => {
    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    setMinDate(formattedDate)
  }, [])

  const validateName = (input) => {
    const lettersOnly = /^[A-Za-z\s]+$/
    return lettersOnly.test(input)
  }

  const calculateDaysDifference = (start, end) => {
    const startDateObj = new Date(start)
    const endDateObj = new Date(end)
    const diffTime = Math.abs(endDateObj - startDateObj)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const RequestLeave = async () => {
    if (!name || !validateName(name)) {
      toast.error('Please enter a valid name (letters only)')
      return
    }

    if (!section || section === 'Select Section') {
      toast.error('Please select a section')
      return
    }

    if (!leaveType || leaveType === 'Select Leave Type') {
      toast.error('Please select a leave type')
      return
    }

    if (!startDate) {
      toast.error('Please select a start date')
      return
    }

    if (!endDate) {
      toast.error('Please select an end date')
      return
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date cannot be before start date')
      return
    }

    const daysDifference = calculateDaysDifference(startDate, endDate)
    if (daysDifference > 5) {
      toast.error('Maximum leave duration is 5 days')
      return
    }

    if (!reason || reason.trim().length < 10) {
      toast.error('Please provide a valid reason (minimum 10 characters)')
      return
    }

    try {
      const response = await axios.post('http://localhost:4000/api/employee/create-leave', {
        name, section, leaveType, startDate, endDate, reason
      }, { headers: { token } })

      if (response.data.success) {
        toast.success('Leave request submitted successfully')
        console.log(response.data)

        setname('')
        setsection('')
        setleaveType('')
        setstartDate('')
        setendDate('')
        setreason('')
      } else {
        toast.error(response.data.message || 'Error submitting leave request')
      }
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message || 'An error occurred')
    }
  }

  const handleNameChange = (e) => {
    const value = e.target.value
    if (validateName(value) || value === '') {
      setname(value)
    }
  }

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value
    setstartDate(selectedDate)

    if (selectedDate) {
      const startDateObj = new Date(selectedDate)
      const maxDateObj = new Date(startDateObj)
      maxDateObj.setDate(startDateObj.getDate() + 5)

      const formattedMaxDate = maxDateObj.toISOString().split('T')[0]
      setMaxDate(formattedMaxDate)

      if (endDate && new Date(endDate) > maxDateObj) {
        setendDate('')
      }
    } else {
      setMaxDate('')
    }
  }

  return (
    <div className="employee-add-leave-container">
      <SideNavBar role="Employer" />
      <div className="employee-add-leave-content">
        <h2 className="employee-add-leave-title">Request Leave</h2>
        <div className="employee-add-leave-form-container">
          <Form>
            <Row className="employee-add-leave-row">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="employee-add-leave-label">Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={handleNameChange}
                    className="employee-add-leave-input"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="employee-add-leave-label">Department</Form.Label>
                  <Form.Select
                    value={section}
                    onChange={(e) => setsection(e.target.value)}
                    className="employee-add-leave-select"
                    required
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
                  <Form.Label className="employee-add-leave-label">Leave Type</Form.Label>
                  <Form.Select
                    value={leaveType}
                    onChange={(e) => setleaveType(e.target.value)}
                    className="employee-add-leave-select"
                    required
                  >
                    <option value="">Select Leave Type</option>
                    <option value="Medical">Medical</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Emergency">Emergency</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="employee-add-leave-row">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="employee-add-leave-label">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    min={minDate}
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="employee-add-leave-input"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="employee-add-leave-label">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    min={startDate || minDate}
                    max={maxEndData}
                    value={endDate}
                    onChange={(e) => setendDate(e.target.value)}
                    className="employee-add-leave-input"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="employee-add-leave-row">
              <Col>
                <Form.Group>
                  <Form.Label className="employee-add-leave-label">Reason</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Type the reason (minimum 10 characters)"
                    rows={4}
                    value={reason}
                    onChange={(e) => setreason(e.target.value)}
                    className="employee-add-leave-input"
                    required
                    minLength={10}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="employee-add-leave-button-container">
              <Button
                className="employee-add-leave-submit-button"
                onClick={RequestLeave}
              >
                Request Leave
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default AddLeave