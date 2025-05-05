import React, { useEffect, useState } from "react";
import './Inventory.css';
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
    <div className="admin-inventory-view-container">
      <div className="admin-inventory-view-content">
        <div className="admin-inventory-view-header">
          <h2 className="admin-inventory-view-title">Premium Export Quality Fish</h2>
          <p className="admin-inventory-view-subtitle">
            Explore our finest selection of fresh, high-quality fish sourced from sustainable waters.
          </p>
        </div>

        <div className="admin-inventory-view-search">
          <Form.Control
            type="search"
            placeholder="Search here..."
            className="admin-inventory-view-search-input"
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-inventory-view-grid">
          {fish.length === 0 ? (
            <p className="admin-inventory-view-no-results">No fish found.</p>
          ) : (
            fish.map((fishItem, index) => (
              <div className="admin-inventory-view-card" key={index}>
                <img
                  src={`http://localhost:4000/images/${fishItem.image}`}
                  alt={fishItem.fishCategory}
                  className="admin-inventory-view-card-image"
                  onError={(e) => { e.target.src = assets.placeholder_fish; }}
                />
                <div className="admin-inventory-view-card-content">
                  <h5 className="admin-inventory-view-card-title">{fishItem.fishCategory}</h5>
                  <p className="admin-inventory-view-card-details">
                    <strong>Gender:</strong> {fishItem.gender} <br />
                    <strong>Size:</strong> {fishItem.size} <br />
                    <strong>Unit Price:</strong> ${fishItem.unitPrice} <br />
                    <strong>Available Quantity:</strong> {fishItem.quantity}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;