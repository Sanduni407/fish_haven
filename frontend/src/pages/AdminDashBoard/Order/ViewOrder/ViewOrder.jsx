import React, { useEffect, useState } from 'react'
import './ViewOrder.css'
import SideNavBar from '../../../../components/SideNavBar/SideNavBar'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {  useNavigate } from 'react-router-dom';

const ViewOrder = () => {

  const navigate = useNavigate()

  const[orders,setOrders] = useState([]);

  const [selectedRowId, setSelectedRowId] = useState(null);
  
  const[status,setStatus] = useState('')

  const [modalShow, setModalShow] = useState(false);

  const [cart, setCart] = useState([])

  


  const fetchAllOrders = async()=>{

    try{

      const response = await axios.get('http://localhost:4000/api/order/get-orders');

      if(response.data.success)
      {
        console.log("success")
        setOrders(response.data.orders)

      }

    }catch(err)
    {
      console.log(err);
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


  const updateOrderStatus = async()=>{

    try{

      const response = await axios.put(`http://localhost:4000/api/order/update-status/${selectedRowId}`,{status});

      if(response.data.success)
      {
        console.log("successfully updated")
        setSelectedRowId(null);
        fetchAllOrders()
        setStatus("")
      }

    }catch(err)
    {
      console.log(err);
    }
  }


  const deleteOrder = async()=>{

    try{

      const response = await axios.delete(`http://localhost:4000/api/order/delete-order/${selectedRowId}`);

      if(response.data.success)
      {
        console.log("successfully deleted")
        setSelectedRowId(null);
        fetchAllOrders()
        
      }

    }catch(err)
    {
      console.log(err);
    }
  }

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



  return (
    <div className="admin-view-order-container">
    <div className="left-column">
      <SideNavBar role={"Admin"}/>
    </div>
    <div className="right-column">

    <div className="admin-order-header">
          <div className="admin-order-left">
            <button className="admin-order-btn admin-order-remove" onClick={deleteOrder}>Remove</button>
            <button className="admin-order-btn admin-order-request" onClick={()=>{fetchAOrder(selectedRowId); setModalShow(true);}}>View Order Description</button>
            <button className="admin-order-btn admin-order-request" onClick={()=>{navigate(`/admin/create-delivery/${selectedRowId}`) }}>Create Delivery Record</button>
          </div>
          <div className="admin-order-right">
            <select className="admin-order-status" onChange={(e)=>{setStatus(e.target.value)}} value={status}>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
             
            </select>
            <button className="admin-order-btn admin-order-update" onClick={updateOrderStatus} >Update</button>
          </div>
        </div>

        {/* Table */}
        <table className="admin-order-table">
          <thead>
            <tr>
              <th> </th>
              <th>Order ID</th>
              <th>Shipping address</th>
              <th>Shipping date</th>
              <th>Order type</th>
              <th>Order status</th>
              <th>View description</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order,index)=>{
              return(
                 <tr key={index}>
              <td>
                <input type="checkbox" className="admin-order-checkbox"  checked={selectedRowId === order._id}
                onChange={() => fetchSelectedRowId(order._id)} />
              </td>
              <td>{order.orderCode}</td>
              <td>{order.shippingAddress}</td>
              <td>{order.shippingDate}</td>
              <td>{order.orderType}</td>
              <td>{order.contact}</td>
              <td>{order.status}</td>
              <td>
                <button className="admin-order-view-btn" onClick={()=>{  navigate(`/admin/place-farm-orders/${order.orderCode}`)}}>Order Request</button>
              </td>
            </tr>
              )
            })}
           
          </tbody>
        </table>
    
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

export default ViewOrder