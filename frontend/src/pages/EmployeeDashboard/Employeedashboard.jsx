import React, { useEffect, useRef } from 'react';
import './EmployeeDashboard.css';
import SideNavBar from '../../components/SideNavBar/SideNavBar';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const cardsRef = useRef([]);

  // Dashboard sections with emoji icons instead of FA icons
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

  // Function to create ripple effect on card click
  const createRippleEffect = (event, cardElement) => {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    
    const rect = cardElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    cardElement.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  };

  // Handle card click with ripple effect and navigation
  const handleCardClick = (event, path, index) => {
    createRippleEffect(event, cardsRef.current[index]);
    
    // Navigate after ripple animation starts
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  // Animation for cards on initial render
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100 * index);
      }
    });
  }, []);

  return (
    <div className="employee-dashboard-container">
      <div className="employee-dashboard-left-column">
        <SideNavBar role="Employer" />
      </div>
      <div className="employee-dashboard-right-column">
        <div className="employee-dashboard-content">
          <div className="employee-dashboard-header">
            <h1 className="employee-dashboard-title">Employee Dashboard</h1>
            <p className="employee-dashboard-subtitle">
              Welcome to your employee management portal
            </p>
          </div>
          
          <div className="employee-dashboard-cards">
            <div className="employee-dashboard-row employee-dashboard-row-top">
              {dashboardSections.map((section, index) => (
                <div
                  key={index}
                  className="employee-dashboard-card"
                  ref={(el) => (cardsRef.current[index] = el)}
                  onClick={(e) => handleCardClick(e, section.path, index)}
                  style={{ 
                    opacity: 0, 
                    transform: 'translateY(30px)',
                    transition: `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s`
                  }}
                >
                  <div className="employee-dashboard-card-icon-container">
                    <span className="employee-dashboard-card-icon">{section.icon}</span>
                  </div>
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