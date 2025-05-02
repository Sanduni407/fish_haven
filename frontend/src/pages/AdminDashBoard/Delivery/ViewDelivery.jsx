import React, { useEffect, useState } from 'react'
import './ViewDelivery.css'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from "react-bootstrap/Table";
import SideNavBar from '../../../components/SideNavBar/SideNavBar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ViewDelivery = () => {

    const navigate = useNavigate();

    const[deliveries,setDeliveries] = useState([]);

    const[PackagingArray,setPackagingArray] = useState([]);

     const [modalShow, setModalShow] = useState(false);

     const[search, setSearch] = useState("");

    const fetchAllDeliveries = async()=>{

        try{
    
          const response = await axios.get(`http://localhost:4000/api/delivery/get-deliveries?searchText=${search}`);
    
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

      useEffect(()=>{
        fetchAllDeliveries()
      },[search])

      const deleteDelivery = async(id)=>{
        try{

          const response = await axios.delete(`http://localhost:4000/api/delivery/delete-delivery/${id}`);
      
              if(response.data.success)
              {
                console.log("successfully deleted")
                toast.success('Record deleted successfully')
                fetchAllDeliveries()
              }

        }catch(err)
        {
          console.log(err)
        }
      }



      const downloadOrderPDF = async (id) => {
        try {
          const response = await axios.get(`http://localhost:4000/api/delivery/fetch-a-delivery/${id}`);
      
          if (response.data.success) {
            const delivery = response.data.deliveryRecord;
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
            doc.text("Delivery Report", pageWidth / 2, 40, { align: "center" });
      
            // Order Details with spacing
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
      
            let yPosition = 55;
            doc.text(`Delivery Code: ${delivery.delCode}`, margin + 2, yPosition);
      
            yPosition += 8;
            doc.text(`Order Code: ${delivery.orderCode}`, margin + 2, yPosition);
      
            yPosition += 8;
            doc.text(`Shipping Address: ${delivery.shippingAddress}`, margin + 2, yPosition);
      
            yPosition += 8;
            doc.text(`Shippment Date: ${delivery.deliveryDate}`, margin + 2, yPosition);
      
            yPosition += 8;
            doc.text(`Contact No: ${delivery.contact}`, margin + 2, yPosition);
      
            yPosition += 8;
            doc.text(`Packaging Type: ${delivery.orderType}`, margin + 2, yPosition);
      
            // Table Data
            const items = delivery.PackagingArray.map(item => [
              item.variety,
              item.quantity,
              item.qtyForPackage,
              item.NoOfPackages
            ]);
      
            // Table with padding from borders
            autoTable(doc, {
              head: [['Variety', 'Quantity', 'Qty per Package', 'No of packages']],
              body: items,
              startY: yPosition + 15, // Start table below the last text
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
      
            const fileName = `Delivery_Report_${delivery.delCode}.pdf`;
            doc.save(fileName);
          }
        } catch (err) {
          console.error("Error downloading PDF:", err);
        }
      };
      
      
  return (


    <div className="view-delivery-container">
  <div className="left-column"><SideNavBar role={"Admin"}/></div>
  <div className="right-column">

     <div>

     <Form.Control placeholder='Search here' type='search' onChange={(e)=>{setSearch(e.target.value)}}/>

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
                <button className="admin-order-view-btn"  onClick={()=>{navigate(`/admin/assign-vehicle/${delivery._id}`)}}>Assign</button>
              </td>
              <td>
                <button className="admin-order-view-btn"  onClick={()=>{downloadOrderPDF(delivery._id)}}>Generate</button>
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
