import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './UserActivityLog.css';

const UserActivityLog = () => {
  const { token } = useContext(AppContext);
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({ email: '', action: '', startDate: '', endDate: '' }); // UPDATED: Changed userId to email

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user-activities', {
        headers: { token },
        params: filters
      });
      if (response.data.success) {
        setActivities(response.data.activities);
      } else {
        console.log('Error fetching activities');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="user-activity-log-container">
      <h2>User Activity Logs</h2>
      <Form className="activity-log-filters">
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label> {/* UPDATED: Changed label to Email */}
          <Form.Control
            type="email" // UPDATED: Changed type to email
            name="email" // UPDATED: Changed name to email
            value={filters.email} // UPDATED: Changed to filters.email
            onChange={handleFilterChange}
            placeholder="Filter by Email (e.g., user@example.com)" // UPDATED: Updated placeholder
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Action</Form.Label>
          <Form.Control
            type="text"
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
            placeholder="Filter by Action (e.g., login)"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </Form.Group>
        <Button onClick={fetchActivities}>Apply Filters</Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity._id}>
              <td>{activity.userId ? `${activity.userId.name} (${activity.userId.email})` : 'N/A'}</td>
              <td>{activity.action}</td>
              <td>{activity.details}</td>
              <td>{new Date(activity.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserActivityLog;