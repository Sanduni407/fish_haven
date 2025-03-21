import React, { useContext, useEffect, useState } from 'react'
import './ViewOrderRequest.css'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';


const ViewOrderRequest = () => {

  const{token} = useContext(AppContext)

  const[orders,setOrders] = useState([])

  const fetchOrderRequest = async()=>{
    try{
       const response = await axios.post('http://localhost:4000/api/order/get-farm-Orders-byuser',{},{headers:{token}})

       if(response.data.success)
       {
        setOrders(response.data.orders)
       }
    }
    catch(err)
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
        fetchOrderRequest()
       }
    }
    catch(err)
    {
      console.log(err)
    }
  }
  
  useEffect(()=>{
    fetchOrderRequest()
  },[])

  return (
    <div className="supplier-view-order">
    <div className="left-column">
        <SideNavBar role={"Supplier"}/>
    </div>
    <div className="right-column">

   {orders.map((order,index)=>{
       return(
        <Card key={index} style={{marginTop:'50px',marginLeft:'80px',marginRight:'80px', backgroundColor:'#F1F0E9'}}>
      <Card.Body>
        <Card.Title>Order:    {order.orderCode}</Card.Title>
        <Card.Text>
         <div className="supplier-order-container">
                 <div className="left-corner">
                   <p><strong>Fish Variety: </strong> {order.selectedCategory}</p> 
                   <p><strong>Size: </strong> {order.size}</p>
                   <p><strong>Quantity: </strong> {order.quantity}</p>       
                  <p><strong> Expected Delivery Date: </strong> {order.date}</p> 
                  </div>
                  <div className="right-corner">
                      <Button variant="outline-danger" style={{width:'80px'}} onClick={()=>{deleteOrder(order._id)}}>Delete</Button>
                  </div>
               
         </div> 
        
        </Card.Text>
       
      </Card.Body>
    </Card>
       )
   })}
    

    </div>
  </div>
  
  )
}

export default ViewOrderRequest