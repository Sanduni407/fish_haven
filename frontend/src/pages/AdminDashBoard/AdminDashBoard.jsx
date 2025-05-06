import React from 'react'
import './AdminDashBoard.css'
import SideNavBar from '../../components/SideNavBar/SideNavBar'
import { useNavigate } from 'react-router-dom'

const AdminDashBoard = () => {
  const navigate = useNavigate() 

  const dashboardSections = [
    {
      title: 'User Management',
      description: 'Manage user accounts and registration requests.',
      icon: '👤',
      path: '/admin-users',
    },
    {
      title: 'Order Management',
      description: 'Track and manage orders and related requests.',
      icon: '📦',
      path: '/admin/view-orders',
    },
    {
      title: 'Employee Management',
      description: 'Oversee employee leaves and attendance.',
      icon: '💼',
      path: '/admin/view-leaves',
    },
    {
      title: 'Delivery Management',
      description: 'Monitor and manage delivery schedules.',
      icon: '🚚',
      path: '/admin/view-deliveries',
    },
    {
      title: 'Inventory Management',
      description: 'Update and monitor fish inventory.',
      icon: '🐟',
      path: '/admin/manage-inventory',
    },
  ]

  return (
    <div className="admin-dashboard-container">
      <SideNavBar role="Admin" />
      <div className="admin-dashboard-content">
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        <div className="admin-dashboard-cards">
          <div className="admin-dashboard-row admin-dashboard-row-top">
            {dashboardSections.slice(0, 3).map((section, index) => (
              <div
                key={index}
                className="admin-dashboard-card"
                onClick={() => navigate(section.path)}
              >
                <span className="admin-dashboard-card-icon">{section.icon}</span>
                <h3 className="admin-dashboard-card-title">{section.title}</h3>
                <p className="admin-dashboard-card-description">{section.description}</p>
              </div>
            ))}
          </div>
          <div className="admin-dashboard-row admin-dashboard-row-bottom">
            {dashboardSections.slice(3, 5).map((section, index) => (
              <div
                key={index}
                className="admin-dashboard-card"
                onClick={() => navigate(section.path)}
              >
                <span className="admin-dashboard-card-icon">{section.icon}</span>
                <h3 className="admin-dashboard-card-title">{section.title}</h3>
                <p className="admin-dashboard-card-description">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashBoard