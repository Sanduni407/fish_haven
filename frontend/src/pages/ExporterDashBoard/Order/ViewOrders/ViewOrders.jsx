import React, { useContext, useEffect, useState } from 'react'
import './ViewOrders.css'
import SideNavBar from '../../../../components/SideNavBar/SideNavBar'
import { AppContext } from '../../../../context/AppContext'
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const ViewOrders = () => {

  const navigate = useNavigate()

  const {token} = useContext(AppContext)   

  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState([])

  const [modalShow, setModalShow] = useState(false);

  const [selectedRowId, setSelectedRowId] = useState(null);

  const fetchAllOrders = async()=>{

    try{

      const response = await axios.post('http://localhost:4000/api/order/get-orders-byuser',{},{headers:{token}});

      if(response.data.success)
      {
        setOrders(response.data.orders)
       
      }

    }catch(err)
    {
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchAllOrders()
   
  },[])


  const fetchSelectedRowId = (id) => {
    console.log(id)
    if (selectedRowId === id) {
      setSelectedRowId(null); 
    } else {
      setSelectedRowId(id); 
    }
  };


  const fetchAOrder = async(id)=>{
    try{

      const response = await axios.post(`http://localhost:4000/api/order/get-order`,{id});
      console.log(response.data.order)

      if(response.data.success)
      {
        console.log(response.data.order.cart)
        setCart(response.data.order.cart)

       
       
      }

    }catch(err)
    {
      console.log(err)
    }
  }

   const deleteOrder = async()=>{
    try{
          
      const response = await axios.delete(`http://localhost:4000/api/order/delete-order/${selectedRowId}`);
     

      if(response.data.success)
      {
        console.log('successfully deleted')  
        fetchAllOrders()     

      }

    }catch(err)
    {
      console.log(err)
    }
   }

  return (
    <div className='view-orders'>

        <SideNavBar role={"Exporter"}/>

        <div className="content-area">

 <div className='update-delete-buttons'>

       <div><button style={{backgroundColor:"#007074"}} onClick={()=>{navigate(`/exporter/update-order/${selectedRowId}`)}}>Update</button></div>
       <div><button  style={{backgroundColor:"#BF3131"}} onClick={deleteOrder}>Remove</button></div>

     </div>
 <div className="table-container">
     <table className="order-table">
        <thead>
          <tr>
            <th> </th>
            <th>Shipping Address</th>
            <th>Shipping Date</th>
            <th>Order Type</th>
            <th>Contact</th>
            <th>Order Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order,index) => (
            <tr key={index}>
              <td> <input type="checkbox" className="admin-order-checkbox"  checked={selectedRowId === order._id}
                onChange={() => fetchSelectedRowId(order._id)} /></td>
              <td>{order.shippingAddress}</td>
              <td>{order.shippingDate}</td>
              <td>{order.orderType}</td>
              <td>{order.contact}</td>
              <td> {order.status}</td>
              <td>
                <button className="view-btn" onClick={() => {
      fetchAOrder(order._id);
      setModalShow(true);
      
     }}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
</div>


<Modal show={modalShow} onHide={()=>{setModalShow(false)}} centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Fish variety</th>
              <th>Size</th>
              <th>Gender</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td>{item.variety}</td>
                <td>{item.size}</td>
                <td>{item.gender}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=> setModalShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
        
        
    </div>
  )
}

export default ViewOrders