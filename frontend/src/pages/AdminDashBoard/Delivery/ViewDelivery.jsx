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
import { assets } from '../../../assets/assets'

const ViewDelivery = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [PackagingArray, setPackagingArray] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAllDeliveries = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/delivery/get-deliveries?searchText=${search}`);
      if (response.data.success) {
        console.log("success")
        setDeliveries(response.data.deliveries)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const fetchaDelivery = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/delivery/fetch-a-delivery/${id}`);
      if (response.data.success) {
        const delivery = response.data.deliveryRecord;
        setPackagingArray(delivery.PackagingArray)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAllDeliveries()
  }, [])

  useEffect(() => {
    fetchAllDeliveries()
  }, [search])

  const deleteDelivery = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/delivery/delete-delivery/${id}`);
      if (response.data.success) {
        console.log("successfully deleted")
        toast.success('Record deleted successfully')
        fetchAllDeliveries()
      }
    } catch (err) {
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
        doc.text("Delivery Report", pageWidth / 2, 40, { align: "center" });
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        let yPosition = 55;
        doc.text(`Delivery Code: ${delivery.delCode}`, margin + 2, yPosition);
        yPosition += 8;
        doc.text(`Order Code: ${delivery.orderCode}`, margin + 2, yPosition);
        yPosition += 8;
        doc.text(`Shipping Address: ${delivery.shippingAddress}`, margin + 2, yPosition);
        yPosition += 8;
        doc.text(`Shipment Date: ${delivery.deliveryDate}`, margin + 2, yPosition);
        yPosition += 8;
        doc.text(`Contact No: ${delivery.contact}`, margin + 2, yPosition);
        yPosition += 8;
        const label = "Packaging Type: ";
        const value = delivery.orderType == "Exporter Type" ? "Exporter Type - Supply Oxygen" : "Normal Type - Normal Packaging";
        doc.setTextColor(0, 0, 0);
        doc.text(label, margin + 2, yPosition);
        const labelWidth = doc.getTextWidth(label);
        doc.setTextColor(255, 0, 0);
        doc.text(value, margin + 2 + labelWidth, yPosition);
        doc.setTextColor(0, 0, 0);
        const items = delivery.PackagingArray.map(item => [
          item.variety,
          item.quantity,
          item.qtyForPackage,
          item.NoOfPackages
        ]);
        autoTable(doc, {
          head: [['Variety', 'Quantity', 'Qty per Package', 'No of packages']],
          body: items,
          startY: yPosition + 15,
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
    <div className="admin-view-delivery-container">
      <SideNavBar role="Admin" />
      <div className="admin-view-delivery-content">
        <h2 className="admin-view-delivery-title">Manage Deliveries</h2>
        <div className="admin-view-delivery-search-container">
          <img src={assets.search} alt="search" className="admin-view-delivery-search-icon" />
          <Form.Control
            className="admin-view-delivery-search-input"
            placeholder="Search deliveries..."
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-view-delivery-table-container">
          <Table className="admin-view-delivery-table">
            <thead>
              <tr>
                <th className="admin-view-delivery-th-delivery-id">Delivery ID</th>
                <th className="admin-view-delivery-th-order-id">Order ID</th>
                <th className="admin-view-delivery-th-shipping-address">Shipping Address</th>
                <th className="admin-view-delivery-th-shipment-date">Shipment Date</th>
                <th className="admin-view-delivery-th-contact">Contact Number</th>
                <th className="admin-view-delivery-th-order-type">Order Type</th>
                <th className="admin-view-delivery-th-update"></th>
                <th className="admin-view-delivery-th-delete"></th>
                <th className="admin-view-delivery-th-packaging"></th>
                <th className="admin-view-delivery-th-download"></th>
                <th className="admin-view-delivery-th-assign"></th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery, index) => (
                <tr key={index}>
                  <td>{delivery.delCode}</td>
                  <td>{delivery.orderCode}</td>
                  <td>{delivery.shippingAddress}</td>
                  <td>{delivery.deliveryDate}</td>
                  <td>{delivery.contact}</td>
                  <td>
                    <span className={delivery.orderType === 'Exporter Type' ? 'admin-view-delivery-order-type-exporter' : 'admin-view-delivery-order-type-normal'}>
                      {delivery.orderType === 'Exporter Type' ? 'Supply Oxygen' : 'Normal'}
                    </span>
                  </td>
                  <td>
                    <Button
                      className="admin-view-delivery-update-button"
                      onClick={() => navigate(`/admin/update-delivery/${delivery._id}`)}
                    >
                      <img src={assets.editimg} alt="edit" />
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="admin-view-delivery-delete-button"
                      onClick={() => deleteDelivery(delivery._id)}
                    >
                      <img src={assets.deleteimg} alt="delete" />
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="admin-view-delivery-view-button"
                      onClick={() => { fetchaDelivery(delivery._id); setModalShow(true); }}
                    >
                      <img src={assets.view} alt="view" />
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="admin-view-delivery-download-button"
                      onClick={() => downloadOrderPDF(delivery._id)}
                    >
                      <img src={assets.downloadimg} alt="download" />
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="admin-view-delivery-assign-button"
                      onClick={() => navigate(`/admin/assign-vehicle/${delivery._id}`)}
                    >
                      Assign
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="admin-view-delivery-modal-title">Packaging Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover responsive className="admin-view-delivery-modal-table">
              <thead>
                <tr>
                  <th>Fish Variety</th>
                  <th>Quantity</th>
                  <th>Qty per Package</th>
                  <th>Total Packagings</th>
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
            <Button
              className="admin-view-delivery-modal-close-button"
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

export default ViewDelivery