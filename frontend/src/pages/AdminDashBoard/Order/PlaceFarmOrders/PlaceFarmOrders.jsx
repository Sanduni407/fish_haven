import React, { useEffect, useState } from 'react'
import './PlaceFarmOrders.css'
import SideNavBar from '../../../../components/SideNavBar/SideNavBar'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

const PlaceFarmOrders = () => {
  const { orderCode } = useParams();
  const [fish, setFish] = useState([])
  const [orders, setOrders] = useState([])
  const [expectedshipmentDate, setexpectedShipmentDate] = useState('')
  const [modalShow, setModalShow] = useState(false);

  const [id, setId] = useState('')
  const [code, setOrderCode] = useState('')

  const [selectedCategory, setselectedCategory] = useState('')
  const [selectedFarm, setselectedFarm] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setquantity] = useState('')
  const [date, setDate] = useState('')
  const [userId, setUserId] = useState('')

  const [categoryValid, setCategoryValid] = useState(null);
  const [sizeValid, setSizeValid] = useState(null);
  const [quantityValid, setQuantityValid] = useState(null);
  const [dateValid, setDateValid] = useState(null);
  const [errMessage, setErrMessage] = useState('')

  //updated values


  const [updateselectedCategory, setupdateselectedCategory] = useState('')
  const [updateselectedFarm, setupdateselectedFarm] = useState('')
  const [updatesize, setupdateSize] = useState('')
  const [updatequantity, setupdatequantity] = useState('')
  const [updatedate, setupdateDate] = useState('')


  const [updatecategoryValid, setupdateCategoryValid] = useState(null);
  const [updatesizeValid, setupdateSizeValid] = useState(null);
  const [updatequantityValid, setupdateQuantityValid] = useState(null);
  const [updatedateValid, setupdateDateValid] = useState(null);
  const [updateerrMessage, setupdateErrMessage] = useState('')
  



  const fetchAllFishCategories = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/fish/get-fish-names');
      if (response.data.success) {
        await setFish(response.data.uniqueFishNames)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchaOrder = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/order/get-order-by-ordercode', { orderCode });
      setexpectedShipmentDate(response.data.order.shippingDate)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchFarmOrders()
    fetchAllFishCategories()
    fetchaOrder()
  }, [])

  const fetchBusinessName = async (selectedCategory) => {
    try {
      const response = await axios.post('http://localhost:4000/api/order/get-the-farm', { selectedCategory });
      if (response.data.success) {
        const user = response.data.user
        if(modalShow == true)
        {
          setupdateselectedFarm(user.businessName)
          setUserId(user._id)
        }
        else
        {
          setselectedFarm(user.businessName)
          setUserId(user._id)
        }
      
        
        
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (selectedCategory) {
      fetchBusinessName(selectedCategory);
    }
   
  }, [selectedCategory]);


  useEffect(()=>{

    if(updateselectedCategory)
      {
        fetchBusinessName(updateselectedCategory);
      }

  },[updateselectedCategory])

  const placeOrder = async () => {
    if (!categoryValid || !sizeValid || !quantityValid || !dateValid) {
      toast.error("Please correct invalid fields");
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/api/order/place-farm-order', { orderCode, selectedCategory, size, quantity, date, selectedFarm, userId })
      if (response.data.success) {
        toast.success('order placed successfully')

        fetchFarmOrders()
        setselectedCategory('')
        setselectedFarm('')
        setSize('')
        setquantity('')
        setDate('')
        setCategoryValid(null)
        setSizeValid(null)
        setQuantityValid(null)
        setDateValid(null)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchFarmOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/order/get-all-farm-order');
      if (response.data.success) {
        setOrders(response.data.farmOrders)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteOrder = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/order/delete-farm-order/${id}`)
      if (response.data.success) {
        fetchFarmOrders()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateOrder = async () => {
    if (!updatecategoryValid || !updatesizeValid || !updatequantityValid || !updatedateValid) {
      toast.error("Please correct invalid fields");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:4000/api/order/update-farm-order/${id}`, { orderCode: code, selectedCategory:updateselectedCategory, size:updatesize, quantity:updatequantity, date:updatedate, selectedFarm:updateselectedFarm ,userId})
      if (response.data.success) {
        toast.success('order updated successfully')
        fetchFarmOrders()
        setselectedCategory('')
        setselectedFarm('')
        setSize('')
        setquantity('')
        setDate('')
        setCategoryValid(null)
        setSizeValid(null)
        setQuantityValid(null)
        setDateValid(null)
        setModalShow(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getTheOrder = async (id) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/order/get-farm-order-byorderid`, { id })
      if (response.data.success) {
        const order = response.data.Order
        setId(order._id)
        setupdateselectedCategory(order.selectedCategory)
        setOrderCode(order.orderCode)
        setupdateselectedFarm(order.selectedFarm)
        setupdateSize(order.size)
        setupdatequantity(order.quantity)
        setupdateDate(order.date)

        setupdateCategoryValid(true)
        setupdateSizeValid(true)
        setupdateQuantityValid(true)
        setupdateDateValid(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleFishCategoryChange = (e) => {
    const value = e.target.value;
    setselectedCategory(value);
    setCategoryValid(value !== '');
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setSize(value);
    setSizeValid(value !== '');
  };

  const handleQuantityChange = (e) => {
    const value = parseFloat(e.target.value);
    setquantity(value);
    setQuantityValid(value > 0);
  };


  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const maxDate = new Date(expectedshipmentDate);
    const minDate = new Date();
    if (selectedDate <= minDate || selectedDate > maxDate) {
      setErrMessage(`Deadline date must be between ${minDate.toISOString().split('T')[0]} and ${maxDate.toISOString().split('T')[0]}`);
      setDateValid(false);
      setDate('');
    } else {
      setErrMessage('');
      setDateValid(true);
      setDate(e.target.value);
    }
  };

  


  // validate the update fields 

  const handleupdateFishCategoryChange = (e) => {
    const value = e.target.value;
    setupdateselectedCategory(value);
    setupdateCategoryValid(value !== '');
  };

  const handleupdateSizeChange = (e) => {
    const value = e.target.value;
    setupdateSize(value);
    setupdateSizeValid(value !== '');
  };


  const handleupdateQuantityChange = (e) => {
    const value = parseFloat(e.target.value);
    setupdatequantity(value);
    setupdateQuantityValid(value > 0);
  };


  
  const handleupdateDateChange = async(e) => {
    const selectedDate = new Date(e.target.value);
    const minDate = new Date();
    if (selectedDate <= minDate) {
      setupdateErrMessage(`Deadline date must be a future date`);
      setupdateDateValid(false);
      setupdateDate('');
    } else {
      setupdateErrMessage('');
      setupdateDateValid(true);
      setupdateDate(e.target.value);
    }
  };


  return (
    <div className="admin-place-farm-orders-container">
      <SideNavBar role="Admin" />
      <div className="admin-place-farm-orders-content">
        <h2 className="admin-place-farm-orders-title">Place Farm Orders</h2>
        <div className="admin-place-farm-orders-form">
          <Form>
            <Row className="admin-place-farm-orders-row">
              <Col>
                <Form.Label className="admin-place-farm-orders-label">Order Code</Form.Label>
                <Form.Control
                  className="admin-place-farm-orders-input"
                  placeholder="Order Code"
                  value={orderCode}
                  readOnly
                />
              </Col>
              <Col>
                <Form.Label className="admin-place-farm-orders-label">Fish Category</Form.Label>
                <Form.Select
                  className="admin-place-farm-orders-select"
                  onChange={handleFishCategoryChange}
                  value={selectedCategory}
                >
                  <option>Select fish category</option>
                  {fish.map((fish, index) => (
                    <option key={index} value={fish}>{fish}</option>
                  ))}
                </Form.Select>
                {categoryValid === false && <p className="admin-place-farm-orders-error-text">Select a category</p>}
              </Col>
              <Col>
                <Form.Label className="admin-place-farm-orders-label">Fish Supplier</Form.Label>
                <Form.Control
                  className="admin-place-farm-orders-input"
                  value={selectedFarm}
                  readOnly
                />
              </Col>
            </Row>
            <Row className="admin-place-farm-orders-row">
              <Col>
                <Form.Label className="admin-place-farm-orders-label">Fish Size</Form.Label>
                <Form.Select
                  className="admin-place-farm-orders-select"
                  onChange={handleSizeChange}
                  value={size}
                >
                  <option value="">Select size</option>
                  <option value="large">Large</option>
                  <option value="Medium">Medium</option>
                  <option value="Small">Small</option>
                </Form.Select>
                {sizeValid === false && <p className="admin-place-farm-orders-error-text">Select a size</p>}
              </Col>
              <Col>
                <Form.Label className="admin-place-farm-orders-label">Quantity</Form.Label>
                <Form.Control
                  className="admin-place-farm-orders-input"
                  type="Number"
                  onChange={handleQuantityChange}
                  value={quantity}
                />
                {quantityValid === false && <p className="admin-place-farm-orders-error-text">Must be greater than 0</p>}
              </Col>
              <Col>
                <Form.Label className="admin-place-farm-orders-label">Delivery Deadline</Form.Label>
                <Form.Control
                  className="admin-place-farm-orders-input"
                  type="date"
                  onChange={handleDateChange}
                  value={date}
                />
                {dateValid === false && <p className="admin-place-farm-orders-error-text">{errMessage}</p>}
              </Col>
            </Row>
          </Form>
          <Button
            className="admin-place-farm-orders-place-button"
            onClick={placeOrder}
          >
            Place Order
          </Button>
        </div>
        <div className="admin-place-farm-orders-table-container">
          <Table responsive="md" className="admin-place-farm-orders-table">
            <thead>
              <tr>
                <th>Order Code</th>
                <th>Supplier Farm</th>
                <th>Delivery Deadline</th>
                <th>Fish Category</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Update</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.orderCode}</td>
                  <td>{order.selectedFarm}</td>
                  <td>{order.date}</td>
                  <td>{order.selectedCategory}</td>
                  <td>{order.size}</td>
                  <td>{order.quantity}</td>
                  <td>
                    <Button
                      className="admin-place-farm-orders-update-button"
                      onClick={() => { getTheOrder(order._id); setModalShow(true); }}
                    >
                      Update
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="admin-place-farm-orders-delete-button"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="admin-place-farm-orders-modal-title">Update Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="admin-place-farm-orders-modal-row">
                <Col>
                  <Form.Label className="admin-place-farm-orders-modal-label">Order Code</Form.Label>
                  <Form.Control
                    className="admin-place-farm-orders-modal-input"
                    placeholder="Order Code"
                    value={code}
                    readOnly
                  />
                </Col>
              </Row>
              <Row className="admin-place-farm-orders-modal-row">
                <Col>
                  <Form.Label className="admin-place-farm-orders-modal-label">Fish Category</Form.Label>
                  <Form.Select
                    className="admin-place-farm-orders-modal-select"
                    onChange={handleupdateFishCategoryChange}
                    value={updateselectedCategory}
                  >
                    <option>Select fish category</option>
                    {fish.map((fish, index) => (
                      <option key={index} value={fish}>{fish}</option>
                    ))}
                  </Form.Select>
                  {updatecategoryValid === false && <p className="admin-place-farm-orders-error-text">Select a category</p>}
                </Col>
              </Row>
              <Row className="admin-place-farm-orders-modal-row">
                <Col>
                  <Form.Label className="admin-place-farm-orders-modal-label">Fish Supplier</Form.Label>
                  <Form.Control
                    className="admin-place-farm-orders-modal-input"
                    value={updateselectedFarm}
                    readOnly
                  />
                </Col>
                <Col>
                  <Form.Label className="admin-place-farm-orders-modal-label">Fish Size</Form.Label>
                  <Form.Select
                    className="admin-place-farm-orders-modal-select"
                    onChange={handleupdateSizeChange}
                    value={updatesize}
                  >
                    <option value="">Select size</option>
                    <option value="large">Large</option>
                    <option value="Medium">Medium</option>
                    <option value="Small">Small</option>
                  </Form.Select>
                  {updatesizeValid === false && <p className="admin-place-farm-orders-error-text">Select a size</p>}
                </Col>
              </Row>
              <Row className="admin-place-farm-orders-modal-row">
                <Col>
                  <Form.Label className="admin-place-farm-orders-modal-label">Quantity</Form.Label>
                  <Form.Control
                    className="admin-place-farm-orders-modal-input"
                    type="Number"
                    onChange={handleupdateQuantityChange}
                    value={updatequantity}
                  />
                  {updatequantityValid === false && <p className="admin-place-farm-orders-error-text">Must be greater than 0</p>}
                </Col>
              </Row>
              <Row className="admin-place-farm-orders-modal-row">
                <Col>
                  <Form.Label className="admin-place-farm-orders-modal-label">Delivery Deadline</Form.Label>
                  <Form.Control
                    className="admin-place-farm-orders-modal-input"
                    type="date"
                    onChange={handleupdateDateChange}
                    value={updatedate}
                  />
                  {updatedateValid === false && <p className="admin-place-farm-orders-error-text">{updateerrMessage}</p>}
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="admin-place-farm-orders-modal-update-button"
              onClick={updateOrder}
            >
              Update Order
            </Button>
            <Button
              className="admin-place-farm-orders-modal-close-button"
              onClick={() => setModalShow(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default PlaceFarmOrders