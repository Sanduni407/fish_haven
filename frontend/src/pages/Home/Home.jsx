import React, { useEffect, useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import Navbar from '../../components/Navbar/Navbar'
import axios from 'axios';
import Footer from '../../components/Footer/Footer';
import { assets } from '../../assets/assets';

const Home = () => {
  const [fish, setFish] = useState([]);
  const [search, setSearch] = useState('');
  const [reviews, setreviews] = useState([]);

  const fetchFish = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/fish/getallFish?searchText=${search}`);
      if (response.data.success) {
        setFish(response.data.allfish);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/employee/get-all-reviews`);
      if (response.data.success) {
        setreviews(response.data.reviews);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFish();
    fetchReviews();
  }, []);

  return (
    <div className='home-page-wrapper'>
      <Navbar />
      <Header />
      <div className='home-content-area'>
        <div className='home-welcome-text'>
          <h2 className='home-welcome-title'>Explore the Luxurious Fish Collection</h2>
          <p className='home-quality-note'>Experience the highest quality fish, meticulously bred for vibrant colors and robust health, ensuring excellence in every specimen.</p>
        </div>
        <div id='explore-menu' className='home-fish-display'>
          <div className='home-glass-effect'></div>
          {fish.length === 0 ? (
            <p className="home-fish-empty">No fish found.</p>
          ) : (
            fish.map((fishItem, index) => (
              <div className="home-fish-card-item" key={index}>
                <img
                  src={`http://localhost:4000/images/${fishItem.image}`}
                  alt={fishItem.fishCategory}
                  className="home-fish-card-image"
                  onError={(e) => { e.target.src = assets.placeholder_fish; }}
                />
                <div className='home-fish-card-details'>
                  <h3 className='home-fish-card-name'>{fishItem.fishCategory}</h3>
                  <div className='home-fish-card-info'>
                    <p><strong>Gender:</strong> {fishItem.gender}</p>
                    <p><strong>Size:</strong> {fishItem.size}</p>
                    <p><strong>Unit Price:</strong> ${fishItem.unitPrice}</p>
                    <p><strong>Available Quantity:</strong> {fishItem.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div id='app-download' className='home-about-section'>
          <div className='home-about-story'>
            <h2 className='home-about-heading'>History of Our Journey</h2>
            <p className='home-about-description'>
              Welcome to Fish Haven Ornamental Fish Farm, your trusted destination for vibrant and healthy ornamental fish. Located in a serene aquatic environment, our farm is dedicated to breeding and nurturing a wide variety of exotic species such as guppies, koi, goldfish, and bettas. With a passionate team of aquaculture experts, we ensure each fish is raised with the highest standards of care, quality, and sustainability. Whether you're an aquarium hobbyist or a commercial reseller, Fish Haven is committed to providing beautiful, active, and well-conditioned fish that bring life and color to any tank. Dive into our world and experience the art of ornamental fishkeeping at its finest.
            </p>
            <button className='home-contact-link' style={{width:'200px'}} onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>Contact Us</button>
          </div>
          <div className='home-fish-images'>
            <img src={assets.homeimg} alt="Fish Display 1" style={{height:'350px'}} className='home-fish-image' />
            <img src={assets.homeimgtwo} alt="Fish Display 2" className='home-fish-image' />
          </div>
        </div>

        <div className='home-review-section'>
          <h2 className='home-review-heading'>What Our Customers Say</h2>
          {reviews.length === 0 ? (
            <p className="home-review-empty">No reviews yet.</p>
          ) : (
            <div className='home-review-list'>
              {reviews.map((review, index) => (
                <div className="home-review-card" key={index}>
                  <h3 className='home-review-business-name'>{review.businessName}</h3>
                  <p className='home-review-text'>{review.review}</p>
                  <div className='home-review-meta'>
                    <span className='home-review-date'>{review.date}</span>
                    <span className='home-review-time'>{review.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
      <div id='footer'><Footer /></div>
    </div>
  )
}

export default Home

