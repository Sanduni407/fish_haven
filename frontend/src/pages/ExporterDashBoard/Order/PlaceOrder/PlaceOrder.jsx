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

   // Validation States
   const [contactValid, setContactValid] = useState(null);
   const [addressValid, setAddressValid] = useState(null);
   const [quantityValid, setQuantityValid] = useState(null);
   const [dateValid, setDateValid] = useState(null);
   const [orderTypeValid, setOrderTypeValid] = useState(null);
   const [fishVarietyValid, setFishVarietyValid] = useState(null);
   const [sizeValid, setSizeValid] = useState(null);
   const [genderValid, setGenderValid] = useState(null);

   // Create a cart item
   const [variety, setVariety] = useState('');
   const [size, setSize] = useState('');
   const [gender, setGender] = useState('');
   const [quantity, setQuantity] = useState(0);


   //fetch all fis categories
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



   //add fish varities to the order description list
       const addToCART = (newItem) => {

               if(!variety || !size || !quantity || !gender)
                  {
                      toast.error("Please correct invalid fields");
                      return;
                 }
                     setCartItems(prevstate => [...prevstate, newItem]);
                       console.log(cart);

                     setVariety('')
                     setSize('')
                     setQuantity('')
                     setGender('')


                     setFishVarietyValid(null)
                     setSizeValid(null)
                     setQuantityValid(null)
                     setGenderValid(null)
                   }


    // Contact Number Validation
   const handleContactChange = (e) => {
      const value = e.target.value;
      setContact(value);
      setContactValid(/^\d{10}$/.test(value));
   };
 
   //shipping address validation
   const handleAddressChange = (e) => {
      const value = e.target.value;
      setShippingAddress(value);
      setAddressValid(/^[a-zA-Z0-9,\/ ]{5,}$/.test(value));
   };

   // Quantity Validation
   const handleQuantityChange = (e) => {
      const value = parseFloat(e.target.value);
      setQuantity(value);
      setQuantityValid(value > 0);
   };

   // shipping date Validation 
   const handleDateChange = (e) => {
      const value = e.target.value;
      const today = new Date();
      const selectedDate = new Date(value);
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      setShippingDate(value);
      setDateValid(selectedDate > today);
   };

   // validate details of the dropdowns
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



   //place a order
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
            console.log(response.data);

            setShippingAddress('')
            setContact('')
            setShippingDate('')
            setOrderType('')
            setCartItems([])

            setAddressValid(null)
            setContactValid(null)
            setDateValid(null)
            setOrderTypeValid(null)

         } else {
            toast.error('Order request has been declined');
         }

      } catch (err) {
         console.log(err);
      }
   }


   return (

      <div className='create-order'>
         <SideNavBar role="Exporter" />
         <div className="content-area">
            <br/>
            <Form>
               <Row>
                  <Col>

                     <Form.Label>Shipping address</Form.Label>
                     <Form.Control type='text'  onChange={handleAddressChange} value={shippingAddress} />
                     {addressValid === false && <p className='error-text'>Invalid Address</p>}
                    
                  </Col>

                  <Col>
                     <Form.Label>Expected Shipment Date</Form.Label>
                     <Form.Control type='date' onChange={handleDateChange} value={shippingDate}/>
                     {dateValid === false && <p className='error-text'>Select a future date</p>}
                   
                  </Col>

                  <Col>
                     <Form.Label>Contact Number</Form.Label>
                     <Form.Control type='text'  onChange={handleContactChange}  value={contact}/>
                     {contactValid === false && <p className='error-text'>Invalid Contact</p>}
                    
                  </Col>

                  <Col>
                     <Form.Label>Order Type</Form.Label>
                     <Form.Select onChange={handleOrderTypeChange} value={orderType}>
                        <option>Select Order Type</option>
                        <option value="Normal Type">Normal Type</option>
                        <option value="Exporter Type">Exporter Type</option>
                     </Form.Select>
                     {orderTypeValid === false && <p className='error-text'>Please select a valid order type</p>}
                    
                     
                  </Col>
               </Row>

               <br/>

               <Row>
                  <Col>
                     <Form.Label>Fish Variety</Form.Label>
                     <Form.Select onChange={handleFishVarietyChange}  value={variety}>
                        <option>select fish variety</option>
                        {fishCategory.map((fish, index) => (
                           <option value={fish} key={index}>{fish}</option>
                        ))}
                     </Form.Select>
                     {fishVarietyValid === false && <p className='error-text'>Please select a fish variety</p>}
                    
                  </Col>

                  <Col>
                     <Form.Label>Fish Size</Form.Label>
                     <Form.Select onChange={handleSizeChange} value={size}>
                        <option>select fish size</option>
                        <option value="Medium">Medium</option>
                        <option value="Small">Small</option>
                        <option value="Large">Large</option>
                     </Form.Select>
                     {sizeValid === false && size === '' && <p className='error-text'>Please select a size</p>}
                    
                  </Col>

                  <Col>
                     <Form.Label>Fish Gender</Form.Label>
                     <Form.Select onChange={handleGenderChange} value={gender}>
                        <option>select fish gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Mixed">Mixed</option>
                     </Form.Select>
                     {genderValid === false && <p className='error-text'>Please select a gender</p>}
                    
                  </Col>

                  <Col>
                     <Form.Label>Quantity</Form.Label>
                     <Form.Control type='number'  onChange={handleQuantityChange} value={quantity} />
                     {quantityValid === false && <p className='error-text'>Must be greater than 0</p>}
                    
                  </Col>
               </Row>
            </Form>

            <center>
               <button type='button' className='btn-add-item' onClick={() => {
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
            </center>

            <div className="table-style">
               <table>
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
                                 <button  className='btndelete'
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

               <br /><br />
               <button className='btn-add-item' onClick={placeOrder} style={{ width: '200px' }}>Place order</button>
            </div>
         </div>
      </div>
   )
}

export default PlaceOrder;
