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

const CreateDelivery = () => {
  const { id } = useParams();

  const predefinedPackageSizes = {
    "Betta": 2,
    "Neon tetra": 4,
    "Guppi": 8,
    "Koi": 6,
    "Gold fish": 6,
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
  const [quantity, setQuantity] = useState(0);
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
    setPackagingArray((prevState) => [...prevState, newItem]);
  };

  const CreateDelivery = async () => {
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
    <div className="create-delivery-container">
      <div className="left-column">
        <SideNavBar role="Admin" />
      </div>
      <div className="right-column">
        <Form>
          <Row>
            <Col>
              <label>Order ID</label><br />
              <Form.Control placeholder="Order code" value={orderCode} readOnly />
            </Col>
            <Col>
              <label>Address</label><br />
              <Form.Control placeholder="Shipping address" value={shippingAddress} readOnly />
            </Col>
          </Row>
          <Row>
            <Col>
              <label>Contact No</label><br />
              <Form.Control placeholder="Contact number" value={contact} readOnly />
            </Col>
            <Col>
              <label>Order Type</label><br />
              <Form.Control placeholder="Order Type" value={orderType} readOnly />
            </Col>
            <Col>
              <label>Shipment Date</label><br />
              <Form.Control placeholder="Delivery date" type="date" onChange={handleDateChange} />
              {errMessage && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errMessage}</p>}
            </Col>
          </Row>
          <Row>
            <Col>
              <label>Fish Variety</label><br />
              <Form.Select placeholder="Fish variety" onChange={(e) => setVariety(e.target.value)} required>
                <option>Select fish category</option>
                {fishCategory.map((fish, index) => (
                  <option value={fish} key={index}>{fish}</option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <label>Quantity</label><br />
              <Form.Control placeholder="Quantity" type="number" value={quantity} onChange={handleQuantityChange} required/>
              {quantityError && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{quantityError}</p>}
            </Col>
          </Row>
        </Form>

        <center>
          <button
            type="button"
            className="btn-add-item"
            style={{ width: '200px' }}
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
            + Assign packaging
          </button>
        </center>

        <div className="table-style">
          <table>
            <thead>
              <tr>
                <th>Variety</th>
                <th>Quantity</th>
                <th>QTY for package</th>
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
                      className="btndelete"
                      onClick={() => {
                        setPackagingArray(PackagingArray.filter((_, i) => i !== index));
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <center>
          <Button variant="secondary" style={{ width: '200px' }} onClick={CreateDelivery}>
            Create Delivery
          </Button>
        </center>
      </div>
    </div>
  );
};

export default CreateDelivery;
