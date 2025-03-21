import React, { useEffect, useState } from "react";
import axios from "axios";

const Inventory = () => {
  const [fish, setFish] = useState([]);

  const fetchFish = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/fish/getallFish");

      if (response.data.success) {
        setFish(response.data.allfish);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFish();
  }, []);

  return (
    <>
      {/* Header Section */}
      <div className="text-center my-4">
        <h2 className="fw-bold">🐟 Premium Export Quality Fish</h2>
        <p className="text-muted">
          Explore our finest selection of fresh, high-quality fish sourced from sustainable waters.
        </p>
        <img
          src="https://img.cutenesscdn.com/-/photos.demandstudios.com/getty/article/144/93/463693681.jpg"
          alt="Premium Fish"
          className="img-fluid rounded shadow"
          style={{ maxWidth: "600px" }}
        />
      </div>

      {/* Fish Cards Grid */}
      <div className="container mt-4">
        <div className="row">
          {fish.map((fish, index) => (
            <div className="col-md-4 col-lg-3 mb-4" key={index}>
              <div className="card shadow-sm border-0">
                <img
                  src={
                    fish.imageUrl ||
                    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                  }
                  className="card-img-top"
                  alt={fish.fishCategory}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{fish.fishCategory}</h5>
                  <p className="card-text">
                    <strong>Gender:</strong> {fish.gender} <br />
                    <strong>Size:</strong> {fish.size} <br />
                    <strong>Unit Price:</strong> ${fish.unitPrice} <br />
                    <strong>Available Quantity:</strong> {fish.quantity} <br />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Inventory;
