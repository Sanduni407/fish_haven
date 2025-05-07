import React, { useContext, useEffect, useState } from 'react'
import './ViewOrders.css'
import SideNavBar from '../../../../components/SideNavBar/SideNavBar'
import { AppContext } from '../../../../context/AppContext'
import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/Button"
import Table from "react-bootstrap/Table"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import { assets } from '../../../../assets/assets'

const ViewOrders = () => {
  const navigate = useNavigate()
  const { token } = useContext(AppContext)
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [search, setSearch] = useState('')

  const fetchAllOrders = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/order/get-orders-byuser?searchText=${search}`, {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [search])

  const fetchSelectedRowId = (id) => {
    if (selectedRowId === id) {
      setSelectedRowId(null)
    } else {
      setSelectedRowId(id)
    }
  }

  const fetchAOrder = async (id) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/order/get-order`, { id })
      if (response.data.success) {
        setCart(response.data.order.cart)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteOrder = async (selectedRowId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/order/delete-order/${selectedRowId}`)
      if (response.data.success) {
        fetchAllOrders()
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='exporter-view-orders-container'>
      <SideNavBar role="Exporter" />
      <div className="exporter-view-orders-content">
        <h2 className="exporter-view-orders-title">View Orders</h2>
        <div className="exporter-view-orders-controls">
          <div className="exporter-view-orders-search-container">
            <img src={assets.search} alt="search" className="exporter-view-orders-search-icon" />
            <Form.Control 
              type="search" 
              placeholder="Search orders..." 
              onChange={e => setSearch(e.target.value)} 
              className="exporter-view-orders-search-input"
            />
          </div>
        </div>
        <div className="exporter-view-orders-table-container">
          {orders.length === 0 ? (
            <p className="exporter-view-orders-no-results">No orders found.</p>
          ) : (
            <table className="exporter-view-orders-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Order Code</th>
                  <th>Shipping Address</th>
                  <th>Shipping Date</th>
                  <th>Order Type</th>
                  <th>Contact</th>
                  <th>Order Status</th>
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
                        className="exporter-view-orders-checkbox" 
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
                        className="exporter-view-orders-view-icon" 
                        onClick={() => {
                          fetchAOrder(order._id)
                          setModalShow(true)
                        }}
                      >
                        <img src={assets.view} alt="view" />
                      </button>
                    </td>
                    <td>
                      <button 
                        className="exporter-view-orders-update-icon" 
                        onClick={() => navigate(`/exporter/update-order/${order._id}`)}
                      >
                        <img src={assets.editimg} alt="edit" />
                      </button>
                    </td>
                    <td>
                      <button 
                        className="exporter-view-orders-delete-icon" 
                        onClick={() => deleteOrder(order._id)}
                      >
                        <img src={assets.deleteimg} alt="delete" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="exporter-view-orders-modal-title">Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover responsive className="exporter-view-orders-modal-table">
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
              className="exporter-view-orders-modal-close-button"
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

export default ViewOrders