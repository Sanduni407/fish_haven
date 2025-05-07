import React, { useEffect, useRef } from 'react';
import './SupplierDashboard.css';
import SideNavBar from '../../components/SideNavBar/SideNavBar';
import { useNavigate } from 'react-router-dom';

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const cardsRef = useRef([]);

  // Dashboard sections with emoji icons instead of react-icons
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
    <div className="supplier-dashboard-container">
      <div className="supplier-dashboard-left-column">
        <SideNavBar role="Supplier" />
      </div>
      <div className="supplier-dashboard-right-column">
        <div className="supplier-dashboard-content">
          <div className="supplier-dashboard-header">
            <h1 className="supplier-dashboard-title">Supplier Dashboard</h1>
            <p className="supplier-dashboard-subtitle">
              Welcome to your marine products management portal
            </p>
          </div>
          
          <div className="supplier-dashboard-cards">
            <div className="supplier-dashboard-row supplier-dashboard-row-top">
              {dashboardSections.map((section, index) => (
                <div
                  key={index}
                  className="supplier-dashboard-card"
                  ref={(el) => (cardsRef.current[index] = el)}
                  onClick={(e) => handleCardClick(e, section.path, index)}
                  style={{ 
                    opacity: 0, 
                    transform: 'translateY(30px)',
                    transition: `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s`
                  }}
                >
                  <div className="supplier-dashboard-card-icon-container">
                    <span className="supplier-dashboard-card-icon">{section.icon}</span>
                  </div>
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