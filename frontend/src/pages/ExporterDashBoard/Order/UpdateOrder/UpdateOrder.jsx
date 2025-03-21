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

        setCartItems(prevstate=>[...prevstate,newItem]);
        console.log(cart);
      }

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

   <Form>
          <Row>
          <Col>
              <Form.Control type='text' placeholder='shipment address' value={shippingAddress} onChange={(e)=>{setshippingAddress(e.target.value)}} />
            </Col>

            <Col>
              <Form.Control type='date' placeholder='shipment date' value={shippingDate} onChange={(e)=>{setshippingDate(e.target.value)}}/>
            </Col>
            
            <Col>
              <Form.Control type='text' placeholder='contact number' value={contact} onChange={(e)=>{setcontact(e.target.value)}}/>
            </Col>

            <Col>
              <Form.Select value={orderType} onChange={(e)=>{setorderType(e.target.value)}}>
              <option>Select Order Type</option>
              <option value="Normal Type">Normal Type</option>
              <option value="Exporter Type">Exporter Type</option>
                 </Form.Select>
              
            </Col>  
          </Row>

         

          <Row>
          <Col>
          <Form.Select onChange={(e)=>{setVariety(e.target.value)}}>
          <option>Fish variety</option>
             {fishCategory.map((fish,index)=>(
                <option value={fish} key={index}>{fish}</option>
             ))}   
                 </Form.Select>
            </Col>

            <Col>
          <Form.Select  onChange={(e)=>{setSize(e.target.value)}}>
          <option >Select size</option>
          <option value="Medium">Medium</option>
          <option value="Small">Small</option>
          <option value="Large">Large</option>
                 </Form.Select>
            </Col>

            <Col>
          <Form.Select  onChange={(e)=>{setGender(e.target.value)}}>
          <option >Select gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Mixed">Mixed</option>
                 </Form.Select>
            </Col>
           
           <Col>
            <Form.Control type='number' placeholder='quantity' onChange={(e)=>{setQuantity(parseFloat(e.target.value))}}/>
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