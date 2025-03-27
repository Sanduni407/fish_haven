import React, { useContext, useState, useEffect } from 'react'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddLeave = () => {
  const { token } = useContext(AppContext)

  const [name, setname] = useState('');
  const [leaveType, setleaveType] = useState('');
  const [section, setsection] = useState('');
  const [endDate, setendDate] = useState('');
  const [startDate, setstartDate] = useState('');
  const [reason, setreason] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxEndData, setMaxDate] = useState('');

  // Set minimum date to today when component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setMinDate(formattedDate);
  }, []);

  const validateName = (input) => {
    const lettersOnly = /^[A-Za-z\s]+$/;
    return lettersOnly.test(input);
  };

  const calculateDaysDifference = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diffTime = Math.abs(endDateObj - startDateObj);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
  };

  const RequestLeave = async () => {
    // Validate name
    if (!name || !validateName(name)) {
      toast.error('Please enter a valid name (letters only)');
      return;
    }

    // Validate required fields
    if (!section || section === 'Select Section') {
      toast.error('Please select a section');
      return;
    }

    if (!leaveType || leaveType === 'Select Leave Type') {
      toast.error('Please select a leave type');
      return;
    }

    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }

    if (!endDate) {
      toast.error('Please select an end date');
      return;
    }

    // Validate date range
    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date cannot be before start date');
      return;
    }

    const daysDifference = calculateDaysDifference(startDate, endDate);
    if (daysDifference > 5) {
      toast.error('Maximum leave duration is 5 days');
      return;
    }

    if (!reason || reason.trim().length < 10) {
      toast.error('Please provide a valid reason (minimum 10 characters)');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/employee/create-leave', {
        name, section, leaveType, startDate, endDate, reason
      }, { headers: { token } });

      if (response.data.success) {
        toast.success('Leave request submitted successfully')
        console.log(response.data)

        // Reset form
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
      console.log(err);
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  }

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (validateName(value) || value === '') {
      setname(value);
    }
  };

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    setstartDate(selectedDate);


    // Calculate max end date (5 days after start date)
    if (selectedDate) {
      const startDateObj = new Date(selectedDate);
      const maxDateObj = new Date(startDateObj);
      maxDateObj.setDate(startDateObj.getDate() + 5); // Add 5 days

      const formattedMaxDate = maxDateObj.toISOString().split('T')[0];
      setMaxEndDate(formattedMaxDate);

      // Reset end date if it's beyond the new limit
      if (endDate && new Date(endDate) > maxDateObj) {
        setendDate('');
      }
    } else {
      setMaxEndDate('');
    }
  };

  return (
    <div className="add-leave-container">
      <div className="left-column">
        <SideNavBar role={"Employer"} />
      </div>

      <div className="right-column">
        <Form style={{ marginLeft: '270px' }}>
          <Row>
            <Col>
              <Form.Control
                placeholder='Name'
                value={name}
                onChange={handleNameChange}
                required
              />
            </Col>
            <Col>
              <Form.Select
                placeholder="Department"
                value={section}
                onChange={(e) => { setsection(e.target.value) }}
                required
              >
                <option value="">Select Section</option>
                <option value="Quality Control">Quality Control</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Customer Care">Customer Care</option>
                <option value="Export and Logistics">Export and Logistics</option>
              </Form.Select>
            </Col>

            <Col>
              <Form.Select
                placeholder="LeaveType"
                value={leaveType}
                onChange={(e) => { setleaveType(e.target.value) }}
                required
              >
                <option value="">Select Leave Type</option>
                <option value="Medical">Medical</option>
                <option value="Vacation">Vacation</option>
                <option value="Emergency">Emergency</option>
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control
                placeholder="Start Date"
                type="date"
                min={minDate}
                value={startDate}
                onChange={handleStartDateChange}
                required
              />
            </Col>
            <Col>
              <Form.Control
                placeholder="End Date"
                type="date"
                min={startDate || minDate}
                value={endDate}
                onChange={(e) => { setendDate(e.target.value) }}
                required
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Control
                as="textarea"
                placeholder='Type the reason..'
                rows={3}
                value={reason}
                onChange={(e) => { setreason(e.target.value) }}
                required
                minLength={10}
              />
            </Col>
          </Row>
        </Form>

        <center>
          <Button
            variant="dark"
            style={{ width: '300px', marginLeft: '90px', marginTop: '30px' }}
            onClick={RequestLeave}
          >
            Request Leave
          </Button>
        </center>
      </div>
    </div>
  )
}

export default AddLeave