import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import './UserActivityLog.css';
import { toast } from 'react-toastify';
import SideNavBar from './SideNavBar/SideNavBar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UserActivityLog = () => {
  const { token } = useContext(AppContext);
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({ email: '', action: '', startDate: '', endDate: '' });

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

  const deleteallActivities = async () => {
    try {
      const response = await axios.delete('http://localhost:4000/api/user-activities/delete-all');
      if (response.data.success) {
        toast.success('deleted successfully');
        fetchActivities();
      } else {
        toast.error('Error');
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
//pdf generation
  const downloadOrderPDF = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user-activities', {
        headers: { token },
        params: filters
      });
      if (response.data.success) {
        const activitiesData = response.data.activities;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(margin, margin, pageWidth - margin * 2, 270);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Fish Haven", margin + 2, 18);
        const generatedAt = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated on: ${generatedAt}`, margin + 2, 25);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("User Activity Report", pageWidth / 2, 40, { align: "center" });
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        let yPosition = 55;
        const filteredActivities = activitiesData.map(activity => [
          activity.userId ? `${activity.userId.name} (${activity.userId.email})` : 'N/A',
          activity.action,
          activity.details,
          new Date(activity.timestamp).toLocaleString()
        ]);
        autoTable(doc, {
          head: [['User', 'Action', 'Details', 'Timestamp']],
          body: filteredActivities,
          startY: yPosition + 15,
          theme: 'grid',
          headStyles: {
            fillColor: [15, 30, 80],
            textColor: 255,
            fontSize: 11,
            fontStyle: 'bold'
          },
          bodyStyles: {
            fontSize: 10
          },
          styles: {
            halign: 'center'
          },
          margin: { left: margin + 5, right: margin + 5 }
        });
        const fileName = `User_Activity_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
      }
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  return (
    <div className="user-tracking-main-container">
      <SideNavBar role="Admin" />
      <div className="user-tracking-content">
        <h2 className="user-tracking-title">User Activity Logs</h2>
        <p className="user-tracking-subtitle">Track and manage user activities</p>
        <div className="user-tracking-filters-container">
          <div className="user-tracking-filter-item">
            <label className="user-tracking-filter-label">Email</label>
            <input
              type="email"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Filter by Email (e.g., user@example.com)"
              className="user-tracking-filter-input"
            />
          </div>
          <div className="user-tracking-filter-item">
            <label className="user-tracking-filter-label">Action</label>
            <input
              type="text"
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              placeholder="Filter by Action (e.g., login)"
              className="user-tracking-filter-input"
            />
          </div>
          <div className="user-tracking-filter-item">
            <label className="user-tracking-filter-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="user-tracking-filter-input"
            />
          </div>
          <div className="user-tracking-filter-item">
            <label className="user-tracking-filter-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="user-tracking-filter-input"
            />
          </div>
          <button onClick={fetchActivities} className="user-tracking-apply-button">
            Apply Filters
          </button>
        </div>
        <div className="user-tracking-table-wrapper">
          <div className="user-tracking-table-container">
            <table className="user-tracking-table">
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
                  <tr key={activity._id} className="user-tracking-table-row">
                    <td>{activity.userId ? `${activity.userId.name} (${activity.userId.email})` : 'N/A'}</td>
                    <td>{activity.action}</td>
                    <td>{activity.details}</td>
                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="user-tracking-buttons-container">
            <button onClick={deleteallActivities} className="user-tracking-clear-button">
              Clear All
            </button>
            <button onClick={downloadOrderPDF} className="user-tracking-download-button">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivityLog;