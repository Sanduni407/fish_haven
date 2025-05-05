import React, { useContext, useEffect, useState } from 'react'
import './ViewOrderRequest.css'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import { AppContext } from '../../../context/AppContext'

const ViewOrderRequest = () => {
  const { token } = useContext(AppContext)
  const [orders, setOrders] = useState([])

  const fetchOrderRequest = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/order/get-farm-Orders-byuser', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteOrder = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/order/delete-farm-order/${id}`)
      if (response.data.success) {
        console.log('successfully deleted')
        fetchOrderRequest()
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchOrderRequest()
  }, [])

  return (
    <div className="supplier-view-order-requests-container">
      <SideNavBar role="Supplier" />
      <div className="supplier-view-order-requests-content">
        <h2 className="supplier-view-order-requests-title">Order Requests</h2>
        <div className="supplier-view-order-requests-cards">
          {orders.length === 0 ? (
            <p className="supplier-view-order-requests-no-results">No order requests found.</p>
          ) : (
            orders.map((order, index) => (
              <Card key={index} className="supplier-view-order-requests-card">
                <Card.Body>
                  <Card.Title className="supplier-view-order-requests-card-title">Order: {order.orderCode}</Card.Title>
                  <Card.Text>
                    <div className="supplier-view-order-requests-details">
                      <div className="supplier-view-order-requests-info">
                        <p><strong>Fish Variety:</strong> {order.selectedCategory}</p>
                        <p><strong>Size:</strong> {order.size}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                        <p><strong>Expected Delivery Date:</strong> {order.date}</p>
                      </div>
                      <div className="supplier-view-order-requests-actions">
                        <Button
                          className="supplier-view-order-requests-delete-button"
                          onClick={() => deleteOrder(order._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewOrderRequest