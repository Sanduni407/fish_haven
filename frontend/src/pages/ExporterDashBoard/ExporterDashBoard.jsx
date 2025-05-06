import React from 'react';
import './ExporterDashBoard.css';
import SideNavBar from '../../components/SideNavBar/SideNavBar';
import { useNavigate } from 'react-router-dom';

const ExporterDashBoard = () => {
  const navigate = useNavigate();

  const dashboardSections = [
    {
      title: 'Place an Order',
      description: 'Create a new order for export.',
      icon: '📦',
      path: '/exporter/place-order',
    },
    {
      title: 'View My Orders',
      description: 'Track and manage your export orders.',
      icon: '📜',
      path: '/exporter/view-order',
    },
    {
      title: 'View Full Inventory',
      description: 'Browse the complete inventory available.',
      icon: '🐟',
      path: '/exporter/view-inventory',
    },
    {
      title: 'Post a Review',
      description: 'Share feedback on your experience.',
      icon: '⭐',
      path: '/admin/post-review',
    },
    {
      title: 'Manage User Profile',
      description: 'Update your profile and account settings.',
      icon: '🏢',
      path: '/exporter-view-profile',
    },
  ];

  return (
    <div className="exporter-dashboard-container">
      <div className="exporter-dashboard-left-column">
        <SideNavBar role="Exporter" />
      </div>
      <div className="exporter-dashboard-right-column">
        <div className="exporter-dashboard-content">
          <h1 className="exporter-dashboard-title">Exporter Dashboard</h1>
          <div className="exporter-dashboard-cards">
            <div className="exporter-dashboard-row exporter-dashboard-row-top">
              {dashboardSections.slice(0, 3).map((section, index) => (
                <div
                  key={index}
                  className="exporter-dashboard-card"
                  onClick={() => navigate(section.path)}
                >
                  <span className="exporter-dashboard-card-icon">{section.icon}</span>
                  <h3 className="exporter-dashboard-card-title">{section.title}</h3>
                  <p className="exporter-dashboard-card-description">{section.description}</p>
                </div>
              ))}
            </div>
            <div className="exporter-dashboard-row exporter-dashboard-row-bottom">
              {dashboardSections.slice(3, 5).map((section, index) => (
                <div
                  key={index}
                  className="exporter-dashboard-card"
                  onClick={() => navigate(section.path)}
                >
                  <span className="exporter-dashboard-card-icon">{section.icon}</span>
                  <h3 className="exporter-dashboard-card-title">{section.title}</h3>
                  <p className="exporter-dashboard-card-description">{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExporterDashBoard;