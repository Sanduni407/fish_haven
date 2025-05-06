import React from 'react';
import './EmployeeDashboard.css';
import SideNavBar from '../../components/SideNavBar/SideNavBar';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const dashboardSections = [
    {
      title: 'Place a Leave Request',
      description: 'Submit a new leave request for approval.',
      icon: '📝',
      path: '/employee/add-leave',
    },
    {
      title: 'Manage User Profile',
      description: 'Update your profile and account settings.',
      icon: '👤',
      path: '/employee-view-profile',
    },
    {
      title: 'View Leave Request Status',
      description: 'Check the status of your leave requests.',
      icon: '📋',
      path: '/employee/view-leaves',
    },
  ];

  return (
    <div className="employee-dashboard-container">
      <div className="employee-dashboard-left-column">
        <SideNavBar role="Employer" />
      </div>
      <div className="employee-dashboard-right-column">
        <div className="employee-dashboard-content">
          <h1 className="employee-dashboard-title">Employee Dashboard</h1>
          <div className="employee-dashboard-cards">
            <div className="employee-dashboard-row employee-dashboard-row-top">
              {dashboardSections.map((section, index) => (
                <div
                  key={index}
                  className="employee-dashboard-card"
                  onClick={() => navigate(section.path)}
                >
                  <span className="employee-dashboard-card-icon">{section.icon}</span>
                  <h3 className="employee-dashboard-card-title">{section.title}</h3>
                  <p className="employee-dashboard-card-description">{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;