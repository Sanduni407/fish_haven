import React, { useContext, useEffect, useState } from 'react'
import "./PlaceOrder.css"
import SideNavBar from '../../../../components/SideNavBar/SideNavBar'
import { AppContext } from '../../../../context/AppContext'
import axios from 'axios'
import {toast} from 'react-toastify'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const PlaceOrder = () => {

   const{token} = useContext(AppContext)

   const[fishCategory,setfishCategory] = useState([]);

  const[shippingAddress,setshippingAddress] = useState('');
  const[shippingDate,setshippingDate] = useState('');
  const[orderType,setorderType] = useState('');
  const[contact,setcontact] = useState('');
  const[cart,setCartItems] = useState([]);

  const[variety,setvariety] = useState('');
  const[size,setSize] = useState('');
  const[gender,setgender] = useState('');
  const[quantity,setquantity] = useState(0);


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
    fetchAllFishCategory()
  },[])


  const addToCART = (newItem)=>{

    setCartItems(prevstate=>[...prevstate,newItem]);
    console.log(cart);
  }


  const placeOrder = async()=>{
     
    try{

      const response = await axios.post('http://localhost:4000/api/order/create-order',{
        shippingAddress,shippingDate,orderType,contact,cart
      },{headers:{token}});

      if(response.data.success)
      {
        toast.success('Order placed successfully')    
        console.log(response.data)
      }
      else
      {
        toast.error('Order request has been declined')
      }

    }catch(err)
    {
      console.log(err);
    }
  }

  return (
    <div className='create-order'>
      
     
   
   <SideNavBar role="Exporter"/>

  

   <div className="content-area">

      <Form>
          <Row>
          <Col>
              <Form.Control type='text' placeholder='shipment address' onChange={(e)=>{setshippingAddress(e.target.value)}} />
            </Col>

            <Col>
              <Form.Control type='date' placeholder='shipment date' onChange={(e)=>{setshippingDate(e.target.value)}}/>
            </Col>
            
            <Col>
              <Form.Control type='text' placeholder='contact number' onChange={(e)=>{setcontact(e.target.value)}}/>
            </Col>

            <Col>
              <Form.Select onChange={(e)=>{setorderType(e.target.value)}}>
              <option>Select Order Type</option>
              <option value="Normal Type">Normal Type</option>
              <option value="Exporter Type">Exporter Type</option>
                 </Form.Select>
              
            </Col>  
          </Row>

         

          <Row>
          <Col>
          <Form.Select onChange={(e)=>{setvariety(e.target.value)}}>
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
          <Form.Select  onChange={(e)=>{setgender(e.target.value)}}>
          <option >Select gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Mixed">Mixed</option>
                 </Form.Select>
            </Col>
           
           <Col>
            <Form.Control type='number' placeholder='quantity' onChange={(e)=>{setquantity(parseFloat(e.target.value))}}/>
           </Col>
          </Row>
         
        </Form>
    

    <center><button type='button' className='btn-add-item'
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
          }}
          >Delete</button></td>
        </tr>)
        })}
        
      </tbody>
      </table>

      <br/><br/>
      <button className='btn-add-item' onClick={placeOrder} style={{width:'200px'}}>Place order request</button>
    </div>
    

    

   </div > 
  </div>
  )
}

export default PlaceOrder