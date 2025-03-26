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

    const{id} = useParams();

    const navigate = useNavigate();
  

      const[shippingAddress,setshippingAddress] = useState('');
      const[shippingDate,setshippingDate] = useState('');
      const[orderType,setorderType] = useState('');
      const[contact,setcontact] = useState('');
      const[cart,setCartItems] = useState([]);

       const[fishCategory,setfishCategory] = useState([]);
 
       // states for validate the data

       // Validation States
        const [contactValid, setContactValid] = useState(null);
        const [addressValid, setAddressValid] = useState(null);
        const [quantityValid, setQuantityValid] = useState(null);
        const [dateValid, setDateValid] = useState(null);
        const [orderTypeValid, setOrderTypeValid] = useState(null);
        const [fishVarietyValid, setFishVarietyValid] = useState(null);
        const [sizeValid, setSizeValid] = useState(null);
        const [genderValid, setGenderValid] = useState(null);


       //to add new fish to the order description list
        const [variety, setVariety] = useState('');
        const [size, setSize] = useState('');
        const [gender, setGender] = useState('');
        const [quantity, setQuantity] = useState(0);

    const fetchOrderData = async () => {
          try {

          const response = await axios.post(`http://localhost:4000/api/order/get-order`,{id});
  
          if (response.data.success) {

            const { shippingAddress, shippingDate, orderType,contact, cart } = response.data.order;

            setshippingAddress(shippingAddress);
            setshippingDate(shippingDate);
            setorderType(orderType);
            setcontact(contact); 
            setCartItems(cart); 
  
          } else {
            toast.error('Failed to fetch order details');
          } 
        } catch (error) {

          console.error(error);
          toast.error('Error fetching order data');
        }
      };

    const fetchAllFishCategory = async()=>{
        try{
    
          const response = await axios.get('http://localhost:4000/api/fish/get-fish-names');
    
          if(response.data.success)
          {
            setfishCategory(response.data.uniqueFishNames)
          }
          else
          {
            console.log("error")
          }
        }catch(err)
        {
          console.log(err)
        }
        
      }

      useEffect(()=>{
        fetchOrderData()
        fetchAllFishCategory()
      },[])
    


      const addToCART = (newItem)=>{

        if(!variety || !size || !quantity || !gender)
               {
                   toast.error("Please correct the invalid fields before placing an order.");
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
            setcontact(value);
            setContactValid(/^\d{10}$/.test(value));
         };

       //shipping address validation
          const handleAddressChange = (e) => {
             const value = e.target.value;
             setshippingAddress(value);
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
               setshippingDate(value);
               setDateValid(selectedDate > today);
 };

     // validate details of the dropdowns
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



      const updateOrder = async()=>{

        
         try{
           
            const response = await axios.put(`http://localhost:4000/api/order/update-order/${id}`,{
                shippingAddress, shippingDate, orderType,contact, cart
            })

            if(response.data.success)
            {
                console.log("Order updated successfully")
                navigate('/exporter/view-order')
            }
         }catch(err)
         {
            console.log(err)
         }
      }


  return (
    <div className='create-order'>
      
     
   
   <SideNavBar role="Exporter"/>

  

   <div className="content-area">
    <br/>
   <Form>
          <Row>
          <Col>
              <Form.Label>Shipping address</Form.Label>
              <Form.Control type='text' placeholder='enter your shipping address' value={shippingAddress} onChange={handleAddressChange} />
              {addressValid === false && <span className='error-text'>❌ Invalid Address</span>}
              {addressValid === true && <span className='valid-text'>✅</span>}
            </Col>

            <Col>
              <Form.Label>Expected Shipment Date</Form.Label>
              <Form.Control type='date' placeholder='shipment date' value={shippingDate} onChange={handleDateChange}/>
              {dateValid === false && <span className='error-text'>❌ Select a future date</span>}
              {dateValid === true && <span className='valid-text'>✅</span>}
            </Col>
            
            <Col>
              <Form.Label>Contact Number</Form.Label>
              <Form.Control type='text' placeholder='contact number' value={contact} onChange={handleContactChange}/>
              {contactValid === false && <span className='error-text'>❌ Invalid Contact</span>}
              {contactValid === true && <span className='valid-text'>✅</span>}
            </Col>

            <Col>
              <Form.Label>Order Type</Form.Label>
              <Form.Select value={orderType} onChange={handleOrderTypeChange}>
              <option>Select Order Type</option>
              <option value="Normal Type">Normal Type</option>
              <option value="Exporter Type">Exporter Type</option>
                 </Form.Select>
                 {orderTypeValid === false && <span className='error-text'>❌ Please select a valid order type</span>}
                 {orderTypeValid === true && <span className='valid-text'>✅</span>}  
              
            </Col>  
          </Row>

         <br/>

          <Row>
          <Col>
          <Form.Label>Fish Variety</Form.Label>
          <Form.Select onChange={handleFishVarietyChange}>
          <option>Fish variety</option>
             {fishCategory.map((fish,index)=>(
                <option value={fish} key={index}>{fish}</option>
             ))}   
                 </Form.Select>
                 {fishVarietyValid === false && <span className='error-text'>❌ Please select a fish variety</span>}
                 {fishVarietyValid === true && <span className='valid-text'>✅</span>}
            </Col>

            <Col>
           <Form.Label>Fish Size</Form.Label>
          <Form.Select  onChange={handleSizeChange}>
          <option >Select size</option>
          <option value="Medium">Medium</option>
          <option value="Small">Small</option>
          <option value="Large">Large</option>
                 </Form.Select>
                 {sizeValid === false && size === '' && <span className='error-text'>❌ Please select a size</span>}
                 {sizeValid === true && <span className='valid-text'>✅</span>}    
            </Col>

            <Col>
          <Form.Label>Fish Gender</Form.Label> 
          <Form.Select  onChange={handleGenderChange}>
          <option >Select gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Mixed">Mixed</option>
                 </Form.Select>
                 {genderValid === false && <span className='error-text'>❌ Please select a gender</span>}
                 {genderValid === true && <span className='valid-text'>✅</span>}    
            </Col>
           
           <Col>
            <Form.Label>Quantity</Form.Label>
            <Form.Control type='number' placeholder='quantity' onChange={handleQuantityChange}/>
            {quantityValid === false && <span className='error-text'>❌ Must be greater than 0</span>}
            {quantityValid === true && <span className='valid-text'>✅</span>}
           </Col>
          </Row>
         
        </Form>
    

    <center><button style={{width:'200px', backgroundColor:'#b03a2e', color:'white'}}type='button' className='btn'
    onClick={()=>{
                      
        const item = {
            variety:variety,
            size:size,
            gender:gender,
            quantity:quantity
             }

    addToCART(item)
   }} >+ Add Fish</button></center>
    


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

        {cart.map((item,index)=>{
          return(
          <tr key={index}>
          <td>{item.variety}</td>
          <td>{item.size}</td>
          <td>{item.gender}</td>
          <td>{item.quantity}</td>
          <td><button className='btndelete'
          onClick={() => {
            setCartItems(cart.filter((_, i) => i !== index));
          }}>Delete</button></td>
        </tr>)
        })}
        
      </tbody>
      </table>

      <br/><br/>
      <button className='btn-update' onClick={updateOrder} >Update order request</button>
    </div>
    

    

   </div > 
  </div>
  )
}

export default UpdateOrder