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
      <div className="text-center my-4">
        <h2 className="fw-bold">Premium Export Quality Fish</h2>
        <p className="text-muted">
          Explore our finest selection of fresh, high-quality fish sourced from sustainable waters.
        </p>
      </div>

      {/* Search Bar - Centered */}
      <div className="d-flex justify-content-center my-4">
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
              border: 'none'
            }}
          />
        </div>
      </div>

      {/* Fish Cards Grid */}
      <div className="container mt-4">
        <div className="row g-4">
          {fish.length === 0 ? (
            <p className="text-center">No fish found.</p>
          ) : (
            fish.map((fishItem, index) => (
              <div
                key={index}
                className={fish.length === 1 ? 'col-12 col-md-6 col-lg-4 mx-auto' : 'col-12 col-sm-6 col-md-4 col-lg-3'}
              >
                <div className="card shadow-sm border-0 h-100"  style={{ minWidth: '270px' }}>
                  <img
                    src={`http://localhost:4000/images/${fishItem.image}`}
                    className="card-img-top"
                    alt={fishItem.fishCategory}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{fishItem.fishCategory}</h5>
                    <p className="card-text">
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
