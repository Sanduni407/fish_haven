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
    "Betta": 5,
    "Neon tetra": 4,
    "Cod": 3,
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
    <div className="admin-update-container">
      <div className="left-column">
        <SideNavBar role="Admin" />
      </div>
      <div className="right-column">
        <Form>
          <Row>
            <Col>
              <label>Order ID</label><br />
              <Form.Control placeholder='Order code' value={orderCode} readOnly />
            </Col>
            <Col>
              <label>Address</label><br />
              <Form.Control placeholder='Shipping address' value={shippingAddress} readOnly />
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
              <Form.Control placeholder='Delivery date' value={deliveryDate} type='date' onChange={handleDateChange} />
              {errMessage && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errMessage}</p>}
            </Col>
          </Row>
          <Row>
            <Col>
              <label>Fish Variety</label><br />
              <Form.Select placeholder="Fish variety" onChange={(e) => { setvariety(e.target.value) }} required>
                <option>Select fish category</option>
                {fishCategory.map((fish, index) => (
                  <option value={fish} key={index}>{fish}</option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <label>Quantity</label><br />
              <Form.Control
                placeholder="Quantity"
                type='number'
                value={quantity}
                onChange={handleQuantityChange}
              />
                {quantityError && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{quantityError}</p>}
            </Col>
          </Row>
        </Form>

        <center><button type='button' className='btn-add-item' style={{ width: '200px' }}
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
          }}>+ Assign packaging</button></center>

        <div className="table-style">
          <table>
            <thead>
              <tr>
                <th>Variety</th>
                <th>quantity</th>
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
                  <td><button className='btndelete'
                    onClick={() => {
                      setPackagingArray(PackagingArray.filter((_, i) => i !== index));
                    }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <center><Button variant="secondary" style={{ width: '200px' }} onClick={updateDelivery}>Update Delivery</Button></center>
      </div>
    </div>
  )
}

export default UpdateDelivery;

