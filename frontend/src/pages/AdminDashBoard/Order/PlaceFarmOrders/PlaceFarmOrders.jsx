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

  const {orderCode} = useParams();
 
  const[fish,setFish] = useState([])
  const[orders,setOrders] = useState([])

  const [modalShow, setModalShow] = useState(false);

  const[id,setId] = useState('')
  const[selectedCategory,setselectedCategory] = useState('')
  const[selectedFarm,setselectedFarm] = useState('')
  const[size,setSize] = useState('')
  const[quantity,setquantity] = useState('')
  const[code,setOrderCode] = useState('')
  const[date, setDate] = useState('')
  const[userId,setUserId] = useState('')


   //validate the data

   const [categoryValid, setCategoryValid] = useState(null);
   const [sizeValid, setSizeValid] = useState(null);
   const [quantityValid, setQuantityValid] = useState(null);
   const [dateValid, setDateValid] = useState(null);


  const fetchAllFishCategories = async()=>{
    try{
       const response = await axios.get('http://localhost:4000/api/fish/get-fish-names');

       if(response.data.success)
       {
        await setFish(response.data.uniqueFishNames)
       }
    }catch(err)
    {
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchFarmOrders()
    fetchAllFishCategories()
  },[])

  const fetchBusinessName = async()=>{
    try{
       const response = await axios.post('http://localhost:4000/api/order/get-the-farm',{selectedCategory});

      

       if(response.data.success)
       {
        console.log(response.data.user)

        const user = response.data.user
         setselectedFarm(user.businessName)
         setUserId(user._id)
       }
    }catch(err)
    {
      console.log(err)
    }
  }

  useEffect(() => {
    console.log(selectedCategory)
    if (selectedCategory) {
        fetchBusinessName();
        console.log(selectedFarm)
    }
}, [selectedCategory]);
  

  const placeOrder = async()=>{

    if (!categoryValid || !sizeValid  || !quantityValid || !dateValid) {
      toast.error("Please correct the invalid fields before placing an order.");
      return;
     }
   
    try{

      const response = await axios.post('http://localhost:4000/api/order/place-farm-order',{orderCode,selectedCategory,size,quantity,date,selectedFarm,userId})

     if(response.data.success)
       {
        console.log('order placed successfully')
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
    }catch(err)
    {
      console.log(err)
    }
  }

  const fetchFarmOrders = async()=>{

    try{

      const response = await axios.get('http://localhost:4000/api/order/get-all-farm-order');

      if(response.data.success)
      {
        setOrders(response.data. farmOrders)
      } 
      
    } catch(err)
    {
      console.log(err)
    }

  }


  const deleteOrder = async(id)=>{
    try{
       const response = await axios.delete(`http://localhost:4000/api/order/delete-farm-order/${id}`)

       if(response.data.success)
       {
        console.log('successfully deleted')
        fetchFarmOrders()
       }
    }
    catch(err)
    {
      console.log(err)
    }
  }

  const updateOrder = async()=>{
    try{
      const response = await axios.put(`http://localhost:4000/api/order/update-farm-order/${id}`,{orderCode:code,selectedCategory,size,quantity,date,selectedFarm})

      if(response.data.success)
      {
       console.log('successfully updated')
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
   }
   catch(err)
   {
     console.log(err)
   }
  }

  const getTheOrder=async(id)=>{
    try{
      const response = await axios.post(`http://localhost:4000/api/order/get-farm-order-byorderid`,{id})

      if(response.data.success)
      {
        const order = response.data.Order
        console.log(order)

       setId(order._id)
       setselectedCategory(order.selectedCategory)
       setOrderCode(order.orderCode)
       setselectedFarm(order.selectedFarm)
       setSize(order.size)
       setquantity(order.quantity)
       setDate(order.date)
      }
    }catch(err)
    {
      console.log(err)
    }
  }



  //validate functions

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

  const value = e.target.value;
  const today = new Date();
  const selectedDate = new Date(value);
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  setDate(value);
  setDateValid(selectedDate > today);
};  

  

  return (
    <div className="admin-farm-orders-container">
  <div className="left-column">
     <SideNavBar role={"Admin"}/>
  </div>
  <div className="right-column">
    
  <div className="first-row">

<Form>
    <Row> 
       <Col>
          <Form.Label>Order Code</Form.Label>
          <Form.Control placeholder='Order Code' value={orderCode}  readOnly/>
       </Col>

        <Col>
           <Form.Label>Fish Category</Form.Label>
           <Form.Select placeholder="Last name" onChange={handleFishCategoryChange} value={selectedCategory}>
                   <option>Select fish category</option>
                      {fish.map((fish,index)=>{
                        return(
                          <option key={index} value={fish}>{fish}</option>
                             )
                            })}
             </Form.Select>

        {categoryValid === false && <span className='error-text'>❌ Select a category</span>}
        {categoryValid === true && <span className='valid-text'>✅</span>}

         </Col>

         <Col>
            <Form.Label>Fish Supplier</Form.Label>
            <Form.Control placeholder="Fish supplier" value={selectedFarm}  readOnly />
         </Col>
   </Row>
</Form>

</div>

<div className="second-row">

<Form>
   <Row>
        <Col>
            <Form.Label>Fish Size</Form.Label>
            <Form.Select placeholder="Size" onChange={handleSizeChange} value={size}  >
                  <option value="">select size</option>
                  <option  value='large'>Large</option>
                  <option  value='Medium'>Medium</option>
                 <option  value='Small'>Small</option>
            </Form.Select>
       {sizeValid === false && <span className='error-text'>❌ Select a size</span>}
       {sizeValid === true && <span className='valid-text'>✅</span>}

        </Col>

         <Col>
               <Form.Label>Quantity</Form.Label>
               <Form.Control placeholder="Quantity" type='Number' onChange={handleQuantityChange} value={quantity} />
        {quantityValid === false && <span className='error-text'>❌ Must be greater than 0</span>}
       {quantityValid === true && <span className='valid-text'>✅</span>}
        </Col>

        <Col>
             <Form.Label>Delivery Deadline</Form.Label>
             <Form.Control  type='date' placeholder='Delivery deadline' onChange={handleDateChange} value={date} />
       {dateValid === false && <span className='error-text'>❌ Select a future date</span>}
       {dateValid === true && <span className='valid-text'>✅</span>}
       </Col>
 </Row>
</Form>

</div>

       <Button variant="dark"  onClick={()=>{placeOrder()}} style={{width:'200px', marginTop:'10px',marginBottom:'20px'}}>Place Order</Button>
     
    

    <Table responsive="md">
        <thead>
          
          <tr>
            <th>Order Code</th>
            <th>Supplier Farm</th>
            <th>Delivery deadline</th>
            <th>Fish Category</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Update</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>

         {orders.map((order,index)=>{
          return(
            <tr key={index}>
            <td>{order.orderCode}</td>
            <td>{order.selectedFarm}</td>
            <td>{order.date}</td>
            <td>{order.selectedCategory}</td>
            <td>{order.size}</td>
            <td>{order.quantity}</td>
            <td><Button variant="outline-success" onClick={()=>{ getTheOrder(order._id); setModalShow(true)}}>Update</Button></td>
            <td> <Button variant="outline-danger" onClick={()=>{deleteOrder(order._id)}}>Delete</Button></td>
          </tr>
          )
         })}
         
        </tbody>
      </Table>

  </div>

  <Modal show={modalShow} onHide={()=>{setModalShow(false)}} centered>
      <Modal.Header closeButton>
          <Modal.Title> Update Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form>
             <Row>

                <Col>
                   <Form.Control placeholder='Order Code' value={code}  readOnly/>
                </Col>
            </Row> 
            <Row>
                <Col>
                   <Form.Select placeholder="Last name" onChange={handleFishCategoryChange} value={selectedCategory}>
                            <option>Select fish category</option>
                                {fish.map((fish,index)=>{
                                     return(
                                         <option key={index} value={fish}>{fish}</option>
                                             )
                                             })}
                    </Form.Select>
                {categoryValid === false && <span className='error-text'>❌ Select a category</span>}
                {categoryValid === true && <span className='valid-text'>✅</span>}
          
                </Col>
            </Row>
            <Row>
               <Col>
                    <Form.Control placeholder="Fish supplier" value={selectedFarm} readOnly />
              </Col>

               <Col>
                  <Form.Select placeholder="Size" onChange={handleSizeChange} value={size} >
                         <option value="">select size</option>
                         <option  value='large'>Large</option>
                         <option  value='Medium'>Medium</option>
                        <option  value='Small'>Small</option>
                  </Form.Select>
               {sizeValid === false && <span className='error-text'>❌ Select a size</span>}
               {sizeValid === true && <span className='valid-text'>✅</span>}
              </Col>
           </Row>

           <Row>
              <Col>
                  <Form.Control placeholder="Quantity" type='Number' onChange={handleQuantityChange} value={quantity} />
                      {quantityValid === false && <span className='error-text'>❌ Must be greater than 0</span>}
                      {quantityValid === true && <span className='valid-text'>✅</span>}
             </Col>
         </Row>
         
         <Row>
             <Col>
                   <Form.Control  type='date' placeholder='Delivery deadline' onChange={handleDateChange} value={date} />
                    {dateValid === false && <span className='error-text'>❌ Select a future date</span>}
                    {dateValid === true && <span className='valid-text'>✅</span>}
              </Col>
         </Row>
     </Form>
</Modal.Body>

      <Modal.Footer>
        <div className="farm-order-update">
          <Button variant="success" onClick={()=> updateOrder()} style={{width:'230px'}}>Update Order</Button>
          <Button variant="secondary" onClick={()=> setModalShow(false)} style={{width:'230px'}}>  Close </Button>
        </div>
        
      </Modal.Footer>

    </Modal>

</div>

  )
}

export default PlaceFarmOrders