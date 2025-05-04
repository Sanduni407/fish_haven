import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import { assets } from "../../../assets/assets";

const Inventory = () => {
  const [fish, setFish] = useState([]);
  const [search, setSearch] = useState('');

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

  useEffect(() => {
    fetchFish();
  }, [search]);

  return (
    <>
      {/* Header Section */}
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2 style={{ fontWeight: 'bold' }}>Premium Export Quality Fish</h2>
        <p style={{ color: '#6c757d' }}>
          Explore our finest selection of fresh, high-quality fish sourced from sustainable waters.
        </p>
      </div>

      {/* Search Bar - Centered */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Form.Control
            type="search"
            placeholder="  Search here..."
            onChange={e => setSearch(e.target.value)}
            style={{
              backgroundColor: '#edf2f4',
              paddingLeft: '35px',
              outline: 'none',
              boxShadow: 'none',
              border: 'none',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Fish Cards Grid with proper spacing */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 15px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '20px',
          justifyContent: 'center'
        }}>
          {fish.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>No fish found.</p>
          ) : (
            fish.map((fishItem, index) => (
              <div
                key={index}
                style={{
                  minWidth: '270px',
                  transition: 'transform 0.3s ease'
                }}
              >
                <div style={{
                  height: '100%',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}>
                  <img
                    src={`http://localhost:4000/images/${fishItem.image}`}
                    style={{ 
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    alt={fishItem.fishCategory}
                  />
                  <div style={{ padding: '1.25rem' }}>
                    <h5 style={{ 
                      marginBottom: '0.75rem',
                      fontSize: '1.25rem',
                      fontWeight: '500'
                    }}>
                      {fishItem.fishCategory}
                    </h5>
                    <p style={{ 
                      marginBottom: '0',
                      color: '#212529',
                      lineHeight: '1.6'
                    }}>
                      <strong>Gender:</strong> {fishItem.gender} <br />
                      <strong>Size:</strong> {fishItem.size} <br />
                      <strong>Unit Price:</strong> ${fishItem.unitPrice} <br />
                      <strong>Available Quantity:</strong> {fishItem.quantity} <br />
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Inventory;