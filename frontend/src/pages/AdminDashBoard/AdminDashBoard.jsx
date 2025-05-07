import React, { useEffect, useRef } from 'react'
import './AdminDashBoard.css'
import SideNavBar from '../../components/SideNavBar/SideNavBar'
import { useNavigate } from 'react-router-dom'

const AdminDashBoard = () => {
  const navigate = useNavigate()
  const cardsRef = useRef([])

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
      title: 'Inventory Management',
      description: 'Update and monitor fish inventory.',
      icon: '🐟',
      path: '/admin/manage-inventory',
    },
    {
      title: 'Delivery Management',
      description: 'Monitor and manage delivery schedules.',
      icon: '🚚',
      path: '/admin/view-deliveries',
    },
    {
      title: 'User Activity Logs',
      description: 'View logs of user management activities',
      icon: '📊',
      path: '/admin/user-activity-logs',
    },
  ]

  // Function to create ripple effect on card click
  const createRippleEffect = (event, cardElement) => {
    const ripple = document.createElement('span')
    ripple.classList.add('ripple-effect')
    
    const rect = cardElement.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    
    cardElement.appendChild(ripple)
    
    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove()
    }, 1000)
  }

  // Handle card click with ripple effect and navigation
  const handleCardClick = (event, path, index) => {
    createRippleEffect(event, cardsRef.current[index])
    
    // Navigate after ripple animation starts
    setTimeout(() => {
      navigate(path)
    }, 300)
  }

  // Animation for cards on initial render
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
        setTimeout(() => {
          card.style.opacity = '1'
          card.style.transform = 'translateY(0)'
        }, 100 * index)
      }
    })
  }, [])

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-left-column">
        <SideNavBar role="Admin" />
      </div>
      <div className="admin-dashboard-right-column">
        <div className="admin-dashboard-content">
          <div className="admin-dashboard-header">
            <h1 className="admin-dashboard-title">Admin Dashboard</h1>
            <p className="admin-dashboard-subtitle">
              Welcome to your marine export management portal
            </p>
          </div>
          <div className="admin-dashboard-cards">
            <div className="admin-dashboard-row admin-dashboard-row-top">
              {dashboardSections.slice(0, 3).map((section, index) => (
                <div
                  key={index}
                  className="admin-dashboard-card"
                  ref={(el) => (cardsRef.current[index] = el)}
                  onClick={(e) => handleCardClick(e, section.path, index)}
                  style={{ 
                    opacity: 0, 
                    transform: 'translateY(30px)',
                    transition: `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s`
                  }}
                >
                  <div className="admin-dashboard-card-icon-container">
                    <span className="admin-dashboard-card-icon">{section.icon}</span>
                  </div>
                  <h3 className="admin-dashboard-card-title">{section.title}</h3>
                  <p className="admin-dashboard-card-description">{section.description}</p>
                </div>
              ))}
            </div>
            <div className="admin-dashboard-row admin-dashboard-row-bottom">
              {dashboardSections.slice(3, 6).map((section, index) => (
                <div
                  key={index + 3}
                  className="admin-dashboard-card"
                  ref={(el) => (cardsRef.current[index + 3] = el)}
                  onClick={(e) => handleCardClick(e, section.path, index + 3)}
                  style={{ 
                    opacity: 0, 
                    transform: 'translateY(30px)',
                    transition: `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${(index + 3) * 0.1}s`
                  }}
                >
                  <div className="admin-dashboard-card-icon-container">
                    <span className="admin-dashboard-card-icon">{section.icon}</span>
                  </div>
                  <h3 className="admin-dashboard-card-title">{section.title}</h3>
                  <p className="admin-dashboard-card-description">{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashBoard