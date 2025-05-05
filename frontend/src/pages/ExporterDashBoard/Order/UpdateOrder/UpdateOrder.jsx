import React, { useEffect, useState } from 'react'
import './UpdateOrder.css'
import SideNavBar from '../../../../components/SideNavBar/SideNavBar'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const UpdateOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [shippingAddress, setshippingAddress] = useState('');
    const [shippingDate, setshippingDate] = useState('');
    const [orderType, setorderType] = useState('');
    const [contact, setcontact] = useState('');
    const [cart, setCartItems] = useState([]);
    const [fishCategory, setfishCategory] = useState([]);
    const [contactValid, setContactValid] = useState(null);
    const [addressValid, setAddressValid] = useState(null);
    const [quantityValid, setQuantityValid] = useState(null);
    const [dateValid, setDateValid] = useState(null);
    const [orderTypeValid, setOrderTypeValid] = useState(null);
    const [fishVarietyValid, setFishVarietyValid] = useState(null);
    const [sizeValid, setSizeValid] = useState(null);
    const [genderValid, setGenderValid] = useState(null);
    const [variety, setVariety] = useState('');
    const [size, setSize] = useState('');
    const [gender, setGender] = useState('');
    const [quantity, setQuantity] = useState(0);

    const fetchOrderData = async () => {
        try {
            const response = await axios.post(`http://localhost:4000/api/order/get-order`, { id });
            if (response.data.success) {
                const { shippingAddress, shippingDate, orderType, contact, cart } = response.data.order;
                setshippingAddress(shippingAddress);
                setshippingDate(shippingDate);
                setorderType(orderType);
                setcontact(contact); 
                setCartItems(cart); 
                setContactValid(true);
                setAddressValid(true);
                setDateValid(true);
                setOrderTypeValid(true);
            } else {
                toast.error('Failed to fetch order details');
            } 
        } catch (error) {
            console.error(error);
            toast.error('Error fetching order data');
        }
    };

    const fetchAllFishCategory = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/fish/get-fish-names');
            if (response.data.success) {
                setfishCategory(response.data.uniqueFishNames);
            } else {
                console.log("error");
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchOrderData();
        fetchAllFishCategory();
    }, []);

    const addToCART = (newItem) => {
        if (!variety || !size || !quantity || !gender) {
            toast.error("Please correct invalid fields");
            return;
        }
        setCartItems(prevstate => [...prevstate, newItem]);
        setVariety('');
        setSize('');
        setQuantity('');
        setGender('');
        setFishVarietyValid(null);
        setSizeValid(null);
        setQuantityValid(null);
        setGenderValid(null);
    }

    const handleContactChange = (e) => {
        const value = e.target.value;
        setcontact(value);
        setContactValid(/^\d{10}$/.test(value));
    };

    const handleAddressChange = (e) => {
        const value = e.target.value;
        setshippingAddress(value);
        setAddressValid(/^[a-zA-Z0-9,\/ ]{5,}$/.test(value));
    };

    const handleQuantityChange = (e) => {
        const value = parseFloat(e.target.value);
        setQuantity(value);
        setQuantityValid(value > 0);
    };

    const handleDateChange = (e) => {
        const value = e.target.value;
        const today = new Date();
        const selectedDate = new Date(value);
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        setshippingDate(value);
        setDateValid(selectedDate > today);
    };

    const handleOrderTypeChange = (e) => {
        const value = e.target.value;
        setorderType(value);
        setOrderTypeValid(value !== '');
    };

    const handleFishVarietyChange = (e) => {
        const value = e.target.value;
        setVariety(value);
        setFishVarietyValid(value !== '');
    };

    const handleSizeChange = (e) => {
        const value = e.target.value;
        setSize(value);
        setSizeValid(value !== '');
    };

    const handleGenderChange = (e) => {
        const value = e.target.value;
        setGender(value);
        setGenderValid(value !== '');
    };

    const updateOrder = async () => {
        if (!contactValid || !addressValid || !dateValid || !orderTypeValid) {
            toast.error("Please correct invalid fields");
            return;
        }
        try {
            const response = await axios.put(`http://localhost:4000/api/order/update-order/${id}`, {
                shippingAddress, shippingDate, orderType, contact, cart
            });
            if (response.data.success) {
                console.log("Order updated successfully");
                navigate('/exporter/view-order');
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='exporter-update-order-container'>
            <SideNavBar role="Exporter" />
            <div className="exporter-update-order-content">
                <center><h2 className="exporter-update-order-title">Update Order</h2></center>
                <Form className="exporter-update-order-form">
                    <Row className="exporter-update-order-row">
                        <Col>
                            <Form.Label className="exporter-update-order-label">Shipping Address</Form.Label>
                            <Form.Control 
                                className="exporter-update-order-input" 
                                type='text' 
                                value={shippingAddress} 
                                onChange={handleAddressChange} 
                            />
                            {addressValid === false && <p className='exporter-update-order-error'>Invalid Address</p>}
                        </Col>
                        <Col>
                            <Form.Label className="exporter-update-order-label">Expected Shipment Date</Form.Label>
                            <Form.Control 
                                className="exporter-update-order-input" 
                                type='date' 
                                value={shippingDate} 
                                onChange={handleDateChange}
                            />
                            {dateValid === false && <p className='exporter-update-order-error'>Select a future date</p>}
                        </Col>
                        <Col>
                            <Form.Label className= "exporter-update-order-label">Contact Number</Form.Label>
                            <Form.Control 
                                className="exporter-update-order-input" 
                                type='text' 
                                value={contact} 
                                onChange={handleContactChange}
                            />
                            {contactValid === false && <p className='exporter-update-order-error'>Invalid Contact</p>}
                        </Col>
                        <Col>
                            <Form.Label className="exporter-update-order-label">Order Type</Form.Label>
                            <Form.Select 
                                className="exporter-update-order-select" 
                                value={orderType} 
                                onChange={handleOrderTypeChange}
                            >
                                <option>Select Order Type</option>
                                <option value="Normal Type">Normal Type</option>
                                <option value="Exporter Type">Exporter Type</option>
                            </Form.Select>
                            {orderTypeValid === false && <p className='exporter-update-order-error'>Please select a valid order type</p>}
                        </Col>
                    </Row>
                    <Row className="exporter-update-order-row">
                        <Col>
                            <Form.Label className="exporter-update-order-label">Fish Variety</Form.Label>
                            <Form.Select 
                                className="exporter-update-order-select" 
                                value={variety} 
                                onChange={handleFishVarietyChange}
                            >
                                <option>Select fish variety</option>
                                {fishCategory.map((fish, index) => (
                                    <option value={fish} key={index}>{fish}</option>
                                ))}
                            </Form.Select>
                            {fishVarietyValid === false && <p className='exporter-update-order-error'>Please select a fish variety</p>}
                        </Col>
                        <Col>
                            <Form.Label className="exporter-update-order-label">Fish Size</Form.Label>
                            <Form.Select 
                                className="exporter-update-order-select" 
                                value={size} 
                                onChange={handleSizeChange}
                            >
                                <option>Select fish size</option>
                                <option value="Medium">Medium</option>
                                <option value="Small">Small</option>
                                <option value="Large">Large</option>
                            </Form.Select>
                            {sizeValid === false && size === '' && <p className='exporter-update-order-error'>Please select a size</p>}
                        </Col>
                        <Col>
                            <Form.Label className="exporter-update-order-label">Fish Gender</Form.Label>
                            <Form.Select 
                                className="exporter-update-order-select" 
                                value={gender} 
                                onChange={handleGenderChange}
                            >
                                <option>Select fish gender</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Mixed">Mixed</option>
                            </Form.Select>
                            {genderValid === false && <p className='exporter-update-order-error'>Please select a gender</p>}
                        </Col>
                        <Col>
                            <Form.Label className="exporter-update-order-label">Quantity</Form.Label>
                            <Form.Control 
                                className="exporter-update-order-input" 
                                type='number' 
                                value={quantity} 
                                onChange={handleQuantityChange}
                            />
                            {quantityValid === false && <p className='exporter-update-order-error'>Must be greater than 0</p>}
                        </Col>
                    </Row>
                    <div className="exporter-update-order-form-button-container">
                        <button 
                            type='button' 
                            className='exporter-update-order-add-button' 
                            onClick={() => {
                                const item = {
                                    variety: variety,
                                    size: size,
                                    gender: gender,
                                    quantity: quantity
                                }
                                addToCART(item)
                            }}
                        >
                            + Add Fish
                        </button>
                    </div>
                </Form>
                <div className="exporter-update-order-table-container">
                    <table className="exporter-update-order-table">
                        <thead>
                            <tr>
                                <th>Variety</th>
                                <th>Size</th>
                                <th>Gender</th>
                                <th>Quantity</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.variety}</td>
                                        <td>{item.size}</td>
                                        <td>{item.gender}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            <button 
                                                className='exporter-update-order-delete-button'
                                                onClick={() => {
                                                    setCartItems(cart.filter((_, i) => i !== index));
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className="exporter-update-order-submit-container">
                        <button 
                            className='exporter-update-order-submit-button' 
                            onClick={updateOrder}
                        >
                            Update Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateOrder