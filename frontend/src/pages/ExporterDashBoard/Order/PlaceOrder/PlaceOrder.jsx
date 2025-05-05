import React, { useContext, useEffect, useState } from 'react';
import "./PlaceOrder.css";
import SideNavBar from '../../../../components/SideNavBar/SideNavBar';
import { AppContext } from '../../../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const PlaceOrder = () => {
   const { token } = useContext(AppContext);
   const [fishCategory, setFishCategory] = useState([]);
   const [shippingAddress, setShippingAddress] = useState('');
   const [shippingDate, setShippingDate] = useState('');
   const [orderType, setOrderType] = useState('');
   const [contact, setContact] = useState('');
   const [cart, setCartItems] = useState([]);
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

   const fetchAllFishCategory = async () => {
        try {
              const response = await axios.get('http://localhost:4000/api/fish/get-fish-names');
                   if (response.data.success) {
                           setFishCategory(response.data.uniqueFishNames);
                   } else {
                         console.log("error");
                   }
           } catch (err) {
                   console.log(err);
           }
       }

   useEffect(() => {
      fetchAllFishCategory();
   }, []);

   const addToCART = (newItem) => {
               if(!variety || !size || !quantity || !gender) {
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
      setContact(value);
      setContactValid(/^\d{10}$/.test(value));
   };
 
   const handleAddressChange = (e) => {
      const value = e.target.value;
      setShippingAddress(value);
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
      setShippingDate(value);
      setDateValid(selectedDate > today);
   };

   const handleOrderTypeChange = (e) => {
      const value = e.target.value;
      setOrderType(value);
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

   const placeOrder = async () => {
      if (!contactValid || !addressValid  || !dateValid || !orderTypeValid) {
         toast.error("Please correct invalid fields");
         return;
      }
      try {
         const response = await axios.post('http://localhost:4000/api/order/create-order', {
            shippingAddress, shippingDate, orderType, contact, cart
         }, { headers: { token } });
         if (response.data.success) {
            toast.success('Order placed successfully');
            setShippingAddress('');
            setContact('');
            setShippingDate('');
            setOrderType('');
            setCartItems([]);
            setAddressValid(null);
            setContactValid(null);
            setDateValid(null);
            setOrderTypeValid(null);
         } else {
            toast.error('Order request has been declined');
         }
      } catch (err) {
         console.log(err);
      }
   }

   return (
      <div className='exporter-place-order-container'>
         <SideNavBar role="Exporter" />
         <div className="exporter-place-order-content">
            <center><h2 className="exporter-place-order-title">Place New Order</h2></center>
            <Form className="exporter-place-order-form">
               <Row className="exporter-place-order-row">
                  <Col>
                     <Form.Label className="exporter-place-order-label">Shipping Address</Form.Label>
                     <Form.Control 
                        className="exporter-place-order-input" 
                        type='text' 
                        onChange={handleAddressChange} 
                        value={shippingAddress} 
                     />
                     {addressValid === false && <p className='exporter-place-order-error'>Invalid Address</p>}
                  </Col>
                  <Col>
                     <Form.Label className="exporter-place-order-label">Expected Shipment Date</Form.Label>
                     <Form.Control 
                        className="exporter-place-order-input" 
                        type='date' 
                        onChange={handleDateChange} 
                        value={shippingDate}
                     />
                     {dateValid === false && <p className='exporter-place-order-error'>Select a future date</p>}
                  </Col>
                  <Col>
                     <Form.Label className="exporter-place-order-label">Contact Number</Form.Label>
                     <Form.Control 
                        className="exporter-place-order-input" 
                        type='text' 
                        onChange={handleContactChange} 
                        value={contact}
                     />
                     {contactValid === false && <p className='exporter-place-order-error'>Invalid Contact</p>}
                  </Col>
                  <Col>
                     <Form.Label className="exporter-place-order-label">Order Type</Form.Label>
                     <Form.Select 
                        className="exporter-place-order-select" 
                        onChange={handleOrderTypeChange} 
                        value={orderType}
                     >
                        <option>Select Order Type</option>
                        <option value="Normal Type">Normal Type</option>
                        <option value="Exporter Type">Exporter Type</option>
                     </Form.Select>
                     {orderTypeValid === false && <p className='exporter-place-order-error'>Please select a valid order type</p>}
                  </Col>
               </Row>
               <Row className="exporter-place-order-row">
                  <Col>
                     <Form.Label className="exporter-place-order-label">Fish Variety</Form.Label>
                     <Form.Select 
                        className="exporter-place-order-select" 
                        onChange={handleFishVarietyChange} 
                        value={variety}
                     >
                        <option>Select fish variety</option>
                        {fishCategory.map((fish, index) => (
                           <option value={fish} key={index}>{fish}</option>
                        ))}
                     </Form.Select>
                     {fishVarietyValid === false && <p className='exporter-place-order-error'>Please select a fish variety</p>}
                  </Col>
                  <Col>
                     <Form.Label className="exporter-place-order-label">Fish Size</Form.Label>
                     <Form.Select 
                        className="exporter-place-order-select" 
                        onChange={handleSizeChange} 
                        value={size}
                     >
                        <option>Select fish size</option>
                        <option value="Medium">Medium</option>
                        <option value="Small">Small</option>
                        <option value="Large">Large</option>
                     </Form.Select>
                     {sizeValid === false && size === '' && <p className='exporter-place-order-error'>Please select a size</p>}
                  </Col>
                  <Col>
                     <Form.Label className="exporter-place-order-label">Fish Gender</Form.Label>
                     <Form.Select 
                        className="exporter-place-order-select" 
                        onChange={handleGenderChange} 
                        value={gender}
                     >
                        <option>Select fish gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Mixed">Mixed</option>
                     </Form.Select>
                     {genderValid === false && <p className='exporter-place-order-error'>Please select a gender</p>}
                  </Col>
                  <Col>
                     <Form.Label className="exporter-place-order-label">Quantity</Form.Label>
                     <Form.Control 
                        className="exporter-place-order-input" 
                        type='number' 
                        onChange={handleQuantityChange} 
                        value={quantity} 
                     />
                     {quantityValid === false && <p className='exporter-place-order-error'>Must be greater than 0</p>}
                  </Col>
               </Row>
               <div className="exporter-place-order-form-button-container">
                  <button 
                     type='button' 
                     className='exporter-place-order-add-button' 
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
            <div className="exporter-place-order-table-container">
               <table className="exporter-place-order-table">
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
                                    className='exporter-place-order-delete-button'
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
               <div className="exporter-place-order-submit-container">
                  <button 
                     className='exporter-place-order-submit-button' 
                     onClick={placeOrder}
                  >
                     Place Order
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default PlaceOrder;