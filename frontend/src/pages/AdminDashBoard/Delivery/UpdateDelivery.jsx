import React, { useEffect, useState } from 'react'
import './UpdateDelivery.css'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import { useNavigate, useParams } from 'react-router-dom'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import axios from 'axios';

const UpdateDelivery = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const predefinedPackageSizes = {
    "Betta": 2,
    "Neon tetra": 4,
    "Guppi": 8,
    "Trout": 2,
    "Mackerel": 6
  };

  const [delCode, setdelCode] = useState('')
  const [orderCode, setOrderCode] = useState('');
  const [shippingAddress, setshippingAddress] = useState('');
  const [deliveryDate, setdeliveryDate] = useState('');
  const [orderType, setorderType] = useState('');
  const [contact, setcontact] = useState('');
  const [PackagingArray, setPackagingArray] = useState([]);
  const [shipmentDate, setShipmentDate] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [fishCategory, setfishCategory] = useState([]);
  const [variety, setvariety] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [qtyForPackage, setqtyForPackage] = useState(0);
  const [NoOfPackages, setNoOfPackages] = useState(0);
  const [quantityError, setQuantityError] = useState('');

  const fetchaDelivery = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/delivery/fetch-a-delivery/${id}`);
      if (response.data.success) {
        const delivery = response.data.deliveryRecord;
        setdelCode(delivery.delCode)
        setOrderCode(delivery.orderCode)
        setshippingAddress(delivery.shippingAddress)
        setdeliveryDate(delivery.deliveryDate)
        setorderType(delivery.orderType)
        setcontact(delivery.contact)
        setPackagingArray(delivery.PackagingArray)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchAllFishCategory = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/fish/get-fish-names');
      if (response.data.success) {
        setfishCategory(response.data.uniqueFishNames)
      } else {
        console.log("error")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const addToCART = (newItem) => {
    setPackagingArray(prevstate => [...prevstate, newItem]);
    console.log(PackagingArray);
  }

  const fetchaOrder = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/order/get-order-by-ordercode', { orderCode });
      if (response.data.success) {
        setShipmentDate(response.data.order.shippingDate)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchaDelivery();
    fetchAllFishCategory();
  }, [])

  useEffect(() => {
    fetchaOrder()
  }, [orderCode])

  useEffect(() => {
    if (variety in predefinedPackageSizes) {
      const packageSize = predefinedPackageSizes[variety];
      setqtyForPackage(packageSize);
      if (quantity > 0) {
        setNoOfPackages(Math.ceil(quantity / packageSize));
      }
    }
  }, [variety, quantity]);

  const updateDelivery = async () => {
    try {
      const response = await axios.put(`http://localhost:4000/api/delivery/update-a-delivery/${id}`, { PackagingArray, deliveryDate });
      if (response.data.success) {
        toast.success('Successfully updated')
        navigate('/admin/view-deliveries')
      }
    } catch (err) {
      console.log(err)
    }
  }

  // Date validation
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const minDate = new Date(shipmentDate);
    minDate.setDate(minDate.getDate() - 6);

    if (selectedDate < minDate || selectedDate > new Date(shipmentDate)) {
      setErrMessage(`Delivery date must be between ${minDate.toISOString().split('T')[0]} and ${shipmentDate}`);
      setdeliveryDate('');
    } else {
      setErrMessage('');
      setdeliveryDate(e.target.value);
    }
  };

  // Quantity validation
  const handleQuantityChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value <= 0) {
      setQuantityError('Quantity must be greater than 0');
    } else {
      setQuantityError('');
    }
    setQuantity(value);
  };

  return (
    <div className="admin-update-delivery-container">
      <SideNavBar role="Admin" />
      <div className="admin-update-delivery-content">
        <center><h2 className="admin-update-delivery-title">Update Delivery</h2></center>
        <Form className="admin-update-delivery-form">
          <Row className="admin-update-delivery-row">
            <Col>
              <Form.Label className="admin-update-delivery-label">Order ID</Form.Label>
              <Form.Control
                className="admin-update-delivery-input"
                placeholder="Order code"
                value={orderCode}
                readOnly
              />
            </Col>
            <Col>
              <Form.Label className="admin-update-delivery-label">Shipping Address</Form.Label>
              <Form.Control
                className="admin-update-delivery-input"
                placeholder="Shipping address"
                value={shippingAddress}
                readOnly
              />
            </Col>
            <Col>
              <Form.Label className="admin-update-delivery-label">Contact Number</Form.Label>
              <Form.Control
                className="admin-update-delivery-input"
                placeholder="Contact number"
                value={contact}
                readOnly
              />
            </Col>
            <Col>
              <Form.Label className="admin-update-delivery-label">Order Type</Form.Label>
              <Form.Control
                className="admin-update-delivery-input"
                placeholder="Order Type"
                value={orderType}
                readOnly
              />
            </Col>
          </Row>
          <Row className="admin-update-delivery-row">
            <Col>
              <Form.Label className="admin-update-delivery-label">Shipment Date</Form.Label>
              <Form.Control
                className="admin-update-delivery-input"
                placeholder="Delivery date"
                value={deliveryDate}
                type="date"
                onChange={handleDateChange}
              />
              {errMessage && (
                <p className="admin-update-delivery-error">{errMessage}</p>
              )}
            </Col>
            <Col>
              <Form.Label className="admin-update-delivery-label">Fish Variety</Form.Label>
              <Form.Select
                className="admin-update-delivery-select"
                onChange={(e) => setvariety(e.target.value)}
                required
              >
                <option>Select fish category</option>
                {fishCategory.map((fish, index) => (
                  <option value={fish} key={index}>{fish}</option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Label className="admin-update-delivery-label">Quantity</Form.Label>
              <Form.Control
                className="admin-update-delivery-input"
                placeholder="Quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
              />
              {quantityError && (
                <p className="admin-update-delivery-error">{quantityError}</p>
              )}
            </Col>
          </Row>
          <div className="admin-update-delivery-form-button-container">
            <button
              type="button"
              className="admin-update-delivery-add-button"
              onClick={() => {
                if (quantity > 0) {
                  const item = {
                    variety: variety,
                    quantity: quantity,
                    qtyForPackage: qtyForPackage,
                    NoOfPackages: NoOfPackages
                  }
                  addToCART(item);
                } else {
                  toast.error("Please enter a valid quantity greater than 0.");
                }
              }}
            >
              + Assign Packaging
            </button>
          </div>
        </Form>
        <div className="admin-update-delivery-table-container">
          <table className="admin-update-delivery-table">
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
                      className="admin-update-delivery-delete-button"
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
          <div className="admin-update-delivery-submit-container">
            <button
              className="admin-update-delivery-submit-button"
              onClick={updateDelivery}
            >
              Update Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateDelivery