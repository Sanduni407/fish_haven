import React, { useEffect, useState } from 'react';
import './CreateDelivery.css';
import SideNavBar from '../../../components/SideNavBar/SideNavBar';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import {assets} from '../../../assets/assets'

const CreateDelivery = () => {
  const { id } = useParams();

  const predefinedPackageSizes = {
    "Betta": 2,
    "Neon tetra": 4,
    "Guppi": 8,
    "Koi": 6,
    "Gold fish": 6,
    "Neo": 3,
  };

  const [userId, setUserId] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderType, setOrderType] = useState('');
  const [contact, setContact] = useState('');
  const [shipmentDate, setShipmentDate] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [PackagingArray, setPackagingArray] = useState([]);
  const [variety, setVariety] = useState('');
  const [quantity, setQuantity] = useState('');
  const [qtyForPackage, setQtyForPackage] = useState(0);
  const [NoOfPackages, setNoOfPackages] = useState(0);
  const [fishCategory, setFishCategory] = useState([]);
  const [quantityError, setQuantityError] = useState('');

  const fetchAOrder = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/order/get-order', { id });
      if (response.data.success) {
        const order = response.data.order;
        setUserId(order.userId);
        setOrderCode(order.orderCode);
        setShippingAddress(order.shippingAddress);
        setOrderType(order.orderType);
        setContact(order.contact);
        setShipmentDate(order.shippingDate);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllFishCategory = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/fish/get-fish-names');
      if (response.data.success) {
        setFishCategory(response.data.uniqueFishNames);
      } else {
        console.log('error');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAOrder();
    fetchAllFishCategory();
  }, []);

  useEffect(() => {
    if (variety in predefinedPackageSizes) {
      const packageSize = predefinedPackageSizes[variety];
      setQtyForPackage(packageSize);
      if (quantity > 0) {
        setNoOfPackages(Math.ceil(quantity / packageSize));
      }
    }
  }, [variety, quantity]);

  const handleQuantityChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value <= 0) {
      setQuantityError('Quantity must be greater than 0');
    } else {
      setQuantityError('');
    }
    setQuantity(value);
  };

  const addToCART = (newItem) => {
    if (!newItem.quantity || newItem.quantity <= 0) {
      toast.error('Quantity must be greater than 0 to add to the package.');
      return;
    }
    setPackagingArray((prevState) => [...prevState, newItem]);
  };

  const CreateDelivery = async () => {
    // Validate PackagingArray and quantity before submission
    if (PackagingArray.length === 0) {
      toast.error('Please add at least one fish package before submitting.');
      return;
    }
    for (const item of PackagingArray) {
      if (!item.quantity || item.quantity <= 0) {
        toast.error('All packages must have a quantity greater than 0.');
        return;
      }
    }
    try {
      const response = await axios.post('http://localhost:4000/api/delivery/create-delivery', { userId, orderCode, shippingAddress, deliveryDate, orderType, contact, PackagingArray });
      if (response.data.success) {
        toast.success('Record added successfully');
      } else {
        console.log('error');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const minDate = new Date(shipmentDate);
    minDate.setDate(minDate.getDate() - 6);

    if (selectedDate < minDate || selectedDate > new Date(shipmentDate)) {
      setErrMessage(`Delivery date must be between ${minDate.toISOString().split('T')[0]} and ${shipmentDate}`);
      setDeliveryDate('');
    } else {
      setErrMessage('');
      setDeliveryDate(e.target.value);
    }
  };

  return (
    <div className="admin-create-delivery-container">
      <SideNavBar role="Admin" />
      <div className="admin-create-delivery-content">
        <center><h2 className="admin-create-delivery-title">Create Delivery</h2></center>
        <Form className="admin-create-delivery-form">
          <Row className="admin-create-delivery-row">
            <Col>
              <Form.Label className="admin-create-delivery-label">Order ID</Form.Label>
              <Form.Control
                className="admin-create-delivery-input"
                placeholder="Order code"
                value={orderCode}
                readOnly
              />
            </Col>
            <Col>
              <Form.Label className="admin-create-delivery-label">Shipping Address</Form.Label>
              <Form.Control
                className="admin-create-delivery-input"
                placeholder="Shipping address"
                value={shippingAddress}
                readOnly
              />
            </Col>
            <Col>
              <Form.Label className="admin-create-delivery-label">Contact Number</Form.Label>
              <Form.Control
                className="admin-create-delivery-input"
                placeholder="Contact number"
                value={contact}
                readOnly
              />
            </Col>
          </Row>
          <Row className="admin-create-delivery-row">
            <Col>
              <Form.Label className="admin-create-delivery-label">Order Type</Form.Label>
              <Form.Control
                className="admin-create-delivery-input"
                placeholder="Order Type"
                value={orderType}
                readOnly
              />
            </Col>
            <Col>
              <Form.Label className="admin-create-delivery-label">Shipment Date</Form.Label>
              <Form.Control
                className="admin-create-delivery-input"
                placeholder="Delivery date"
                type="date"
                onChange={handleDateChange}
              />
              {errMessage && <p className="admin-create-delivery-error">{errMessage}</p>}
            </Col>
            <Col>
              <Form.Label className="admin-create-delivery-label">Fish Variety</Form.Label>
              <Form.Select
                className="admin-create-delivery-select"
                onChange={(e) => setVariety(e.target.value)}
                required
              >
                <option>Select fish category</option>
                {fishCategory.map((fish, index) => (
                  <option value={fish} key={index}>{fish}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="admin-create-delivery-row">
            <Col>
              <Form.Label className="admin-create-delivery-label">Quantity</Form.Label>
              <Form.Control
                className="admin-create-delivery-input"
                placeholder="Quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                required
              />
              {quantityError && <p className="admin-create-delivery-error">{quantityError}</p>}
            </Col>
            <Col></Col>
            <Col></Col>
          </Row>
          <div className="admin-create-delivery-form-button-container">
            <button
              type="button"
              className="admin-create-delivery-add-button"
              onClick={() => {
                const item = {
                  variety,
                  quantity,
                  qtyForPackage,
                  NoOfPackages,
                };
                addToCART(item);
              }}
            >
              + Assign Packaging
            </button>
          </div>
        </Form>
        <div className="admin-create-delivery-table-container">
          <table className="admin-create-delivery-table">
            <thead>
              <tr>
                <th>Variety</th>
                <th>Quantity</th>
                <th>Qty for Package</th>
                <th>No of Packages</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {PackagingArray.map((item, index) => (
                <tr key={index}>
                  <td>{item.variety}</td>
                  <td>{item.quantity}</td>
                  <td>{item.qtyForPackage}</td>
                  <td>{item.NoOfPackages}</td>
                  <td>
                    <button
                      className="admin-create-delivery-delete-button"
                      onClick={() => {
                        setPackagingArray(PackagingArray.filter((_, i) => i !== index));
                      }}
                    >
                      <img src={assets.deleteimg} alt="delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="admin-create-delivery-submit-container">
            <button
              className="admin-create-delivery-submit-button"
              onClick={CreateDelivery}
            >
              Create Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDelivery;