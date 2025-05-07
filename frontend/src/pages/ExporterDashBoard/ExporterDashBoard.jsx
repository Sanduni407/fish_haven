import React, { useEffect, useRef } from 'react';
import './ExporterDashboard.css';
import SideNavBar from '../../components/SideNavBar/SideNavBar';
import { useNavigate } from 'react-router-dom';

const ExporterDashboard = () => {
  const navigate = useNavigate();
  const cardsRef = useRef([]);

  // Dashboard sections with emoji icons instead of FA icons
  const dashboardSections = [
    {
      title: 'Place an Order',
      description: 'Create a new order for export with our streamlined process.',
      icon: '📦',
      path: '/exporter/place-order',
    },
    {
      title: 'View My Orders',
      description: 'Track and manage your export orders in real-time.',
      icon: '📋',
      path: '/exporter/view-order',
    },
    {
      title: 'View Full Inventory',
      description: 'Browse our complete marine product inventory.',
      icon: '🐟',
      path: '/view/inventory',
    },
    {
      title: 'Post a Review',
      description: 'Share your experience and help us improve our services.',
      icon: '⭐',
      path: '/admin/post-review',
    },
    {
      title: 'Manage User Profile',
      description: 'Update your profile details and account preferences.',
      icon: '👤',
      path: '/exporter-view-profile',
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
    <div className="exporter-dashboard-container">
      <div className="exporter-dashboard-left-column">
        <SideNavBar role="Exporter" />
      </div>
      <div className="exporter-dashboard-right-column">
        <div className="exporter-dashboard-content">
          <div className="exporter-dashboard-header">
            <h1 className="exporter-dashboard-title">Exporter Dashboard</h1>
            <p className="exporter-dashboard-subtitle">
              Welcome to your marine export management portal
            </p>
          </div>
          
          <div className="exporter-dashboard-cards">
            <div className="exporter-dashboard-row exporter-dashboard-row-top">
              {dashboardSections.slice(0, 3).map((section, index) => (
                <div
                  key={index}
                  className="exporter-dashboard-card"
                  ref={(el) => (cardsRef.current[index] = el)}
                  onClick={(e) => handleCardClick(e, section.path, index)}
                  style={{ 
                    opacity: 0, 
                    transform: 'translateY(30px)',
                    transition: `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s`
                  }}
                >
                  <div className="exporter-dashboard-card-icon-container">
                    <span className="exporter-dashboard-card-icon">{section.icon}</span>
                  </div>
                  <h3 className="exporter-dashboard-card-title">{section.title}</h3>
                  <p className="exporter-dashboard-card-description">{section.description}</p>
                </div>
              ))}
            </div>
            
            <div className="exporter-dashboard-row exporter-dashboard-row-bottom">
              {dashboardSections.slice(3, 5).map((section, index) => (
                <div
                  key={index + 3}
                  className="exporter-dashboard-card"
                  ref={(el) => (cardsRef.current[index + 3] = el)}
                  onClick={(e) => handleCardClick(e, section.path, index + 3)}
                  style={{ 
                    opacity: 0, 
                    transform: 'translateY(30px)',
                    transition: `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${(index + 3) * 0.1}s`
                  }}
                >
                  <div className="exporter-dashboard-card-icon-container">
                    <span className="exporter-dashboard-card-icon">{section.icon}</span>
                  </div>
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

export default ExporterDashboard;