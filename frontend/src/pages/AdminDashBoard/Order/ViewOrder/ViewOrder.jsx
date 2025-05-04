import React, { useEffect, useState } from 'react'
import './ViewOrder.css'
import SideNavBar from '../../../../components/SideNavBar/SideNavBar'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {  useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {assets} from '../../../../assets/assets'

const ViewOrder = () => {

  const navigate = useNavigate()

  const[orders,setOrders] = useState([]);

  const [selectedRowId, setSelectedRowId] = useState(null);
  
  const[status,setStatus] = useState('')

  const [modalShow, setModalShow] = useState(false);

  const [cart, setCart] = useState([])

  const[search,setSearch] = useState('')

  const[summary,setSummary] = useState({})

  


  const fetchAllOrders = async()=>{

    try{

      const response = await axios.get(`http://localhost:4000/api/order/get-orders?searchText=${search}`);

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



  const fetchSummary = async()=>{
    try{

      const response = await axios.get(`http://localhost:4000/api/order/fetch-summary`);

      if(response.data.success)
        {
          console.log("success")
          setSummary(response.data)
  
        }

    }catch(err)
    {
      console.log(err);
    }
  }


  useEffect(()=>{
    fetchAllOrders()
    fetchSummary()
  },[search])


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
        fetchSummary()
        setStatus("")
      }

    }catch(err)
    {
      console.log(err);
    }
  }


  const deleteOrder = async(selectedRowId)=>{

    try{

      const response = await axios.delete(`http://localhost:4000/api/order/delete-order/${selectedRowId}`);

      if(response.data.success)
      {
        console.log("successfully deleted")
        setSelectedRowId(null);
        fetchAllOrders()
        fetchSummary()
        
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




  const downloadOrderPDF = async (orderId) => {
    if (!orderId) {
      alert("Please select an order first.");
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:4000/api/order/get-order`, { id: orderId });
  
      if (response.data.success) {
        const order = response.data.order;
        const doc = new jsPDF();
  
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
  
        // Draw a border around the page
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(margin, margin, pageWidth - margin * 2, 270);
  
        // "Fish Haven" - top-left with larger font
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Fish Haven", margin + 2, 18);
  
        // Date & Time just below "Fish Haven"
        const generatedAt = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated on: ${generatedAt}`, margin + 2, 25);
  
        // Title - "Order Report" centered a bit lower
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Order Report", pageWidth / 2, 40, { align: "center" });
  
        // Order Details
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Order Code: ${order.orderCode}`, margin + 2, 55);
        doc.text(`Shipping Address: ${order.shippingAddress}`, margin + 2, 63);
        doc.text(`Shipping Date: ${order.shippingDate}`, margin + 2, 71);
        doc.text(`Order Type: ${order.orderType}`, margin + 2, 79);
        doc.text(`Status: ${order.status}`, margin + 2, 87);
  
        // Table Data
        const items = order.cart.map(item => [
          item.variety,
          item.size,
          item.gender,
          item.quantity
        ]);
  
        // Table with padding from borders
        autoTable(doc, {
          head: [['Variety', 'Size', 'Gender', 'Quantity']],
          body: items,
          startY: 100,
          theme: 'grid',
          headStyles: {
            fillColor: [15, 30, 80], // Navy dark blue
            textColor: 255,
            fontSize: 11,
            fontStyle: 'bold'
          },
          bodyStyles: {
            fontSize: 10
          },
          styles: {
            halign: 'center'
          },
          margin: { left: margin + 5, right: margin + 5 } // extra padding from the borders
        });
  
        const fileName = `Order_Report_${order.orderCode}.pdf`;
        doc.save(fileName);
      }
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };
  


  return (
    <div className="admin-view-order-container">
    <div className="left-column">
      <SideNavBar role={"Admin"}/>
    </div>
    <div className="right-column">

    <div className="admin-order-header">
          <div className="admin-order-left">
            <button className="admin-order-btn admin-order-request"  style={{fontSize:'14px', fontWeight:'normal'}} onClick={()=>{navigate(`/admin/create-delivery/${selectedRowId}`) }}>Create Delivery</button>
          </div>

          <div className="admin-order-right">
            <select className="admin-order-status" onChange={(e)=>{setStatus(e.target.value)}} value={status}>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
             
            </select>
            <button className="admin-order-btn admin-order-update" style={{fontSize:'14px', fontWeight:'normal'}} onClick={updateOrderStatus} >Update</button>
          </div>
        </div>



        <div className="admin-order-summary" style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
               <div className="summary-box" style={{ padding: '10px', backgroundColor: '#edf2f4', borderRadius: '8px' }}>
                   <strong>Pending:</strong> {summary.pending}
              </div>
             <div className="summary-box" style={{ padding: '10px', backgroundColor: '#edf6f9', borderRadius: '8px' }}>
                   <strong>Confirmed:</strong> {summary.confirmed}
             </div>
             <div className="summary-box" style={{ padding: '10px', backgroundColor: '#ffe5ec', borderRadius: '8px' }}>
                <strong>Rejected:</strong> {summary.rejected}
              </div>
        </div>



        <div style={{ position: 'relative', width: '30%', marginTop: '60px' }}>
  <span style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)',color: '#6c757d',fontSize: '16px'}}><img src={assets.search}/></span>
  <Form.Control type="search" placeholder="  Search orders here..." onChange={e => setSearch(e.target.value)} style={{ backgroundColor: '#edf2f4',paddingLeft: '35px',outline: 'none', boxShadow: 'none', border: 'none'}}/>
      </div>

       
        <table className="admin-order-table">
          <thead>
            <tr>
              <th> </th>
              <th>Order ID</th>
              <th>Shipping address</th>
              <th>Shipping date</th>
              <th>Order type</th>
              <th>Contact No</th>
              <th>Order status</th>
              <th> </th>
              <th> </th>
              <th> </th>
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
                <button className="admin-order-view-btn" style={{fontSize:'14px', fontWeight:'normal'}}  onClick={()=>{  navigate(`/admin/place-farm-orders/${order.orderCode}`)}}>Order Request</button>
               
              </td>
              <td>
              <button style={{background:'transparent', padding:'4px'}} onClick={() => downloadOrderPDF(order._id)}><img src={assets.downloadimg}/></button>
              </td>
              <td>
              <button style={{ background:'transparent', padding:'4px'}} onClick={()=>{deleteOrder(order._id)}}><img src={assets.deleteimg}/></button>
              </td>
              <td>
              <button style={{background:'transparent', padding:'4px'}} onClick={()=>{fetchAOrder(order._id); setModalShow(true);}}><img src={assets.view}/></button>
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