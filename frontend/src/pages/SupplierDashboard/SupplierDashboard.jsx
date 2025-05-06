import React from 'react';
import './SupplierDashboard.css';
import SideNavBar from '../../components/SideNavBar/SideNavBar';
import { useNavigate } from 'react-router-dom';

const SupplierDashboard = () => {
  const navigate = useNavigate();

  const dashboardSections = [
    {
      title: 'Manage Fish Inventory',
      description: 'Update and track your fish inventory levels.',
      icon: '🐟',
      path: '/supplier/add-fish',
    },
    {
      title: 'View Order Requests',
      description: 'Review and manage order requests received.',
      icon: '📋',
      path: '/supplier/view-order',
    },
    {
      title: 'Manage Supplier Profile',
      description: 'Edit your supplier details and account settings.',
      icon: '🏢',
      path: '/supplier-view-profile',
    },
  ];

  return (
    <div className="supplier-dashboard-container">
      <div className="supplier-dashboard-left-column">
        <SideNavBar role="Supplier" />
      </div>
      <div className="supplier-dashboard-right-column">
        <div className="supplier-dashboard-content">
          <h1 className="supplier-dashboard-title">Supplier Dashboard</h1>
          <div className="supplier-dashboard-cards">
            <div className="supplier-dashboard-row supplier-dashboard-row-top">
              {dashboardSections.map((section, index) => (
                <div
                  key={index}
                  className="supplier-dashboard-card"
                  onClick={() => navigate(section.path)}
                >
                  <span className="supplier-dashboard-card-icon">{section.icon}</span>
                  <h3 className="supplier-dashboard-card-title">{section.title}</h3>
                  <p className="supplier-dashboard-card-description">{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;