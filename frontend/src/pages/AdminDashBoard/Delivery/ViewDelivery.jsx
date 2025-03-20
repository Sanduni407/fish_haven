import React, { useEffect, useState } from 'react'
import './ViewDelivery.css'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from "react-bootstrap/Table";
import SideNavBar from '../../../components/SideNavBar/SideNavBar';
import { useNavigate } from 'react-router-dom';

const ViewDelivery = () => {

    const navigate = useNavigate();

    const[deliveries,setDeliveries] = useState([]);

    const[PackagingArray,setPackagingArray] = useState([]);

     const [modalShow, setModalShow] = useState(false);

    const fetchAllDeliveries = async()=>{

        try{
    
          const response = await axios.get('http://localhost:4000/api/delivery/get-deliveries');
    
          if(response.data.success)
          {
            console.log("success")
            setDeliveries(response.data.deliveries)
    
          }
    
        }catch(err)
        {
          console.log(err);
        }
      }

      const fetchaDelivery = async(id)=>{
          try{
              const response = await axios.get(`http://localhost:4000/api/delivery/fetch-a-delivery/${id}`);
      
              if(response.data.success)
              {
                 const delivery = response.data.deliveryRecord;
      
                 setPackagingArray(delivery.PackagingArray)
              }
          }catch(err)
          {
            console.log(err)
          }
        }

      useEffect(()=>{
        fetchAllDeliveries()
      },[])


      const deleteDelivery = async(id)=>{
        try{

          const response = await axios.delete(`http://localhost:4000/api/delivery/delete-delivery/${id}`);
      
              if(response.data.success)
              {
                console.log("successfully deleted")
                fetchAllDeliveries()
              }

        }catch(err)
        {
          console.log(err)
        }
      }

      
  return (


    <div className="view-delivery-container">
  <div className="left-column"><SideNavBar role={"Admin"}/></div>
  <div className="right-column">

     <div>

<table className="admin-order-table" >
          <thead>
            <tr>
            
              <th>Delivery ID</th>
              <th>Order ID</th>
              <th>Shipping address</th>
              <th>Shipment date</th>
              <th>Contact Number</th>
              <th>Order type</th>
              <th>Update</th>
              <th>Delete</th>
              <th>Packaging details</th>
              <th>Assign vehicle</th>
             
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery,index)=>{
              return(
                 <tr key={index}>
              <td>{delivery.delCode}</td>
              <td>{delivery.orderCode}</td>
              <td>{delivery.shippingAddress}</td>
              <td>{delivery.deliveryDate}</td>
              <td>{delivery.contact}</td>
              <td>{delivery.orderType == 'Exporter Type' ? <h5 style={{color:'red'}}>Supply Oxygen</h5> : <h5>Normal</h5>}</td>
              <td><Button variant="success" onClick={()=>{navigate(`/admin/update-delivery/${delivery._id}`)}}>Update</Button></td>
              <td> <Button variant="danger" onClick={()=>{deleteDelivery(delivery._id)}}>Remove</Button></td>
              <td><Button variant="primary" onClick={()=>{fetchaDelivery(delivery._id); setModalShow(true);}}>View</Button></td>
              
              <td>
                <button className="admin-order-view-btn"  onClick={()=>{  navigate(`/admin/assign-vehicle/${delivery._id}`)}}>Assign</button>
              </td>
            </tr>
              )
            })}
           
          </tbody>
        </table>
      
    </div>
  </div>

  <Modal show={modalShow} onHide={()=>{setModalShow(false)}} centered>
      <Modal.Header closeButton>
        <Modal.Title>Packaging Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Fish variety</th>
              <th>Quantity</th>
              <th>QTY per package</th>
              <th>Total packagings</th>
            </tr>
          </thead>
          <tbody>
            {PackagingArray.map((item, index) => (
              <tr key={index}>
                <td>{item.variety}</td>
                <td>{item.quantity}</td>
                <td>{item.qtyForPackage}</td>
                <td>{item.NoOfPackages}</td>
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

export default ViewDelivery
