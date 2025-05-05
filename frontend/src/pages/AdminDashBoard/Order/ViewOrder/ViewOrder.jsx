import React, { useEffect, useState } from 'react'
import './ViewOrder.css'
import SideNavBar from '../../../../components/SideNavBar/SideNavBar'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { assets } from '../../../../assets/assets'

const ViewOrder = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [status, setStatus] = useState('')
  const [modalShow, setModalShow] = useState(false);
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [summary, setSummary] = useState({})

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/order/get-orders?searchText=${search}`);
      if (response.data.success) {
        setOrders(response.data.orders)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/order/fetch-summary`);
      if (response.data.success) {
        setSummary(response.data)
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchAllOrders()
    fetchSummary()
  }, [search])

  const fetchSelectedRowId = (id) => {
    if (selectedRowId === id) {
      setSelectedRowId(null);
    } else {
      setSelectedRowId(id);
    }
  };

  const updateOrderStatus = async () => {
    try {
      const response = await axios.put(`http://localhost:4000/api/order/update-status/${selectedRowId}`, { status });
      if (response.data.success) {
        setSelectedRowId(null);
        fetchAllOrders()
        fetchSummary()
        setStatus("")
      }
    } catch (err) {
      console.log(err);
    }
  }

  const deleteOrder = async (selectedRowId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/order/delete-order/${selectedRowId}`);
      if (response.data.success) {
        setSelectedRowId(null);
        fetchAllOrders()
        fetchSummary()
      }
    } catch (err) {
      console.log(err);
    }
  }

  const fetchAOrder = async (id) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/order/get-order`, { id });
      if (response.data.success) {
        setCart(response.data.order.cart)
      }
    } catch (err) {
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
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(margin, margin, pageWidth - margin * 2, 270);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Fish Haven", margin + 2, 18);
        const generatedAt = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated on: ${generatedAt}`, margin + 2, 25);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Order Report", pageWidth / 2, 40, { align: "center" });
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Order Code: ${order.orderCode}`, margin + 2, 55);
        doc.text(`Shipping Address: ${order.shippingAddress}`, margin + 2, 63);
        doc.text(`Shipping Date: ${order.shippingDate}`, margin + 2, 71);
        doc.text(`Order Type: ${order.orderType}`, margin + 2, 79);
        doc.text(`Status: ${order.status}`, margin + 2, 87);
        const items = order.cart.map(item => [
          item.variety,
          item.size,
          item.gender,
          item.quantity
        ]);
        autoTable(doc, {
          head: [['Variety', 'Size', 'Gender', 'Quantity']],
          body: items,
          startY: 100,
          theme: 'grid',
          headStyles: {
            fillColor: [15, 30, 80],
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
          margin: { left: margin + 5, right: margin + 5 }
        });
        const fileName = `Order_Report_${order.orderCode}.pdf`;
        doc.save(fileName);
      }
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  return (
    <div className="admin-view-orders-container">
      <SideNavBar role="Admin" />
      <div className="admin-view-orders-content">
       <h2 className="admin-view-orders-title">Manage Orders</h2>
        <div className="admin-view-orders-header">
          <div className="admin-view-orders-left">
            <button 
              className="admin-view-orders-create-delivery-button" 
              onClick={() => navigate(`/admin/create-delivery/${selectedRowId}`)}
            >
              Create Delivery
            </button>
          </div>
          <div className="admin-view-orders-right">
            <select 
              className="admin-view-orders-status-select" 
              onChange={(e) => setStatus(e.target.value)} 
              value={status}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button 
              className="admin-view-orders-update-button" 
              onClick={updateOrderStatus}
            >
              Update Status
            </button>
          </div>
        </div>
        <div className="admin-view-orders-summary">
          <div className="admin-view-orders-summary-box pending">
            <strong>Pending:</strong> {summary.pending || 0}
          </div>
          <div className="admin-view-orders-summary-box confirmed">
            <strong>Confirmed:</strong> {summary.confirmed || 0}
          </div>
          <div className="admin-view-orders-summary-box rejected">
            <strong>Rejected:</strong> {summary.rejected || 0}
          </div>
        </div>
        <div className="admin-view-orders-search-container">
          <img src={assets.search} alt="search" className="admin-view-orders-search-icon" />
          <Form.Control 
            type="search" 
            placeholder="Search orders..." 
            onChange={e => setSearch(e.target.value)} 
            className="admin-view-orders-search-input"
          />
        </div>
        <div className="admin-view-orders-table-container">
          <table className="admin-view-orders-table">
            <thead>
              <tr>
                <th></th>
                <th>Order ID</th>
                <th>Shipping Address</th>
                <th>Shipping Date</th>
                <th>Order Type</th>
                <th>Contact No</th>
                <th>Order Status</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>
                    <input 
                      type="checkbox" 
                      className="admin-view-orders-checkbox" 
                      checked={selectedRowId === order._id}
                      onChange={() => fetchSelectedRowId(order._id)} 
                    />
                  </td>
                  <td>{order.orderCode}</td>
                  <td>{order.shippingAddress}</td>
                  <td>{order.shippingDate}</td>
                  <td>{order.orderType}</td>
                  <td>{order.contact}</td>
                  <td>{order.status}</td>
                 
                  <td>
                    <button 
                      className="admin-view-orders-download-button"
                      onClick={() => downloadOrderPDF(order._id)}
                    >
                      <img src={assets.downloadimg} alt="download" />
                    </button>
                  </td>
                  <td>
                    <button 
                      className="admin-view-orders-delete-button"
                      onClick={() => deleteOrder(order._id)}
                    >
                      <img src={assets.deleteimg} alt="delete" />
                    </button>
                  </td>
                  <td>
                    <button 
                      className="admin-view-orders-view-button"
                      onClick={() => { fetchAOrder(order._id); setModalShow(true); }}
                    >
                      <img src={assets.view} alt="view" />
                    </button>
                  </td>
                  <td>
                    <button 
                      className="admin-view-orders-request-button"
                      onClick={() => navigate(`/admin/place-farm-orders/${order.orderCode}`)}
                    >
                      Order Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="admin-view-orders-modal-title">Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover responsive className="admin-view-orders-modal-table">
              <thead>
                <tr>
                  <th>Fish Variety</th>
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
            <Button 
              className="admin-view-orders-modal-close-button" 
              onClick={() => setModalShow(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default ViewOrder