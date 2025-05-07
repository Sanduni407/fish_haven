import React, { useContext, useEffect, useState } from 'react';
import './InventoryManage.css';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import SideNavBar from '../../../components/SideNavBar/SideNavBar';
import {assets} from '../../../assets/assets';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const InventoryManage = () => {
  const { token } = useContext(AppContext);
  const [modalShow, setModalShow] = useState(false);

  const[image,setImage] =useState(false);
  const [fishCategory, setfishCategory] = useState('');
  const [gender, setgender] = useState('');
  const [size, setsize] = useState('');
  const [unitPrice, setunitPrice] = useState(0);
  const [quantity, setquantity] = useState(0);

  const [fish, setFish] = useState([]);
  const [id, setId] = useState('');

  const validateForm = () => {
    const nameEn = /^[a-zA-Z\s]+$/;
    if (!nameEn.test(fishCategory)) {
      toast.error('Fish name must only contain letters!');
      return false;
    }

    if (unitPrice <= 0) {
      toast.error('Unit price must be a positive number!');
      return false;
    }

    if (quantity <= 0) {
      toast.error('Quantity must be a positive number!');
      return false;
    }

    return true;
  };

  const createfish = async () => {
    if (!validateForm()) {
      return;
    }

    if (!fishCategory || !gender || !size || unitPrice === 0 || quantity === 0) {
      toast.error('All fields are required!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fishCategory",fishCategory);
      formData.append("gender",gender);
      formData.append("size",size);
      formData.append("unitPrice",unitPrice);
      formData.append("quantity",quantity);
      formData.append("image",image);

      const response = await axios.post('http://localhost:4000/api/fish/create-fish',
          formData,
         {headers:{token}});

      if (response.data.success) {
        toast.success(response.data.message);
        getFishById();
        setfishCategory("");
        setgender('');
        setsize('');
        setunitPrice(0);
        setquantity(0);
        setImage(false);
      }
    } catch (err) {
      console.log(err);
      toast.error('Error creating fish');
    }
  };

  const getFishById = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/fish/getfishById',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setFish(response.data.fishes);
      }
    } catch (err) {
      console.log(err);
      toast.error('Error fetching fish data');
    }
  };

  const deletefish = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/fish/delete-fish/${id}`);
      if (response.data.success) {
        toast.success('Successfully deleted');
        getFishById();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getFishByFishId = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/fish/get-fish-id/${id}`);
      if (response.data.success) {
        const fish = response.data.fish;
        setId(fish._id);
        setfishCategory(fish.fishCategory);
        setgender(fish.gender);
        setsize(fish.size);
        setquantity(fish.quantity);
        setunitPrice(fish.unitPrice);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateFish = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/api/fish/update-fish/${id}`, {
        fishCategory,
        gender,
        size,
        quantity,
        unitPrice,
      });

      if (response.data.success) {
        toast.success('Fish updated successfully');
        getFishById();
        setModalShow(false);
        setfishCategory("");
        setgender('');
        setsize('');
        setunitPrice(0);
        setquantity(0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFishById();
  }, []);

  const downloadFishInventoryPDF = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/fish/getfishById',
        {},
        { headers: { token } }
      );
  
      if (response.data.success) {
        const fishes = response.data.fishes;
  
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
        doc.text("Fish Inventory Report", pageWidth / 2, 40, { align: "center" });
  
        const tableHead = [['Fish Category', 'Gender', 'Size', 'Unit Price ($)', 'Quantity']];
        const tableBody = fishes.map(fish => [
          fish.fishCategory,
          fish.gender,
          fish.size,
          `${fish.unitPrice.toFixed(2)}`,
          `${fish.quantity}`
        ]);
  
        autoTable(doc, {
          head: tableHead,
          body: tableBody,
          startY: 50,
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
            halign: 'center',
            cellPadding: 3
          },
          margin: { left: margin + 5, right: margin + 5 }
        });
  
        doc.save("Fish_Inventory_Report.pdf");
      } else {
        toast.error("Failed to fetch fish data for PDF.");
      }
    } catch (err) {
      console.error("Error generating fish inventory PDF:", err);
      toast.error("Failed to generate PDF.");
    }
  };

  return (
    <div className="admin-inventory-manage-container">
      <SideNavBar role="Admin" />
      <div className="admin-inventory-manage-content">
        <h2 className="admin-inventory-manage-title">Manage Inventory</h2>
        <div className="admin-inventory-manage-form">
          <Form>
            <Row className="admin-inventory-manage-row">
              <Col>
                <Form.Label className="admin-inventory-manage-label" htmlFor="fish-image">
                  <div className="admin-inventory-manage-image-preview">
                    <img
                      src={image ? URL.createObjectURL(image) : assets.upload_area}
                      alt="Fish preview"
                    />
                  </div>
                </Form.Label>
                <Form.Control
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="fish-image"
                  accept="image/*"
                  hidden
                  required
                />
              </Col>
            </Row>
            <Row className="admin-inventory-manage-row">
              <Col>
                <Form.Label className="admin-inventory-manage-label">Fish Category</Form.Label>
                <Form.Control
                  className="admin-inventory-manage-input"
                  type="text"
                  value={fishCategory}
                  onChange={(e) => setfishCategory(e.target.value)}
                  placeholder="Fish category (e.g., Fighter)"
                />
              </Col>
              <Col>
                <Form.Label className="admin-inventory-manage-label">Gender</Form.Label>
                <Form.Select
                  className="admin-inventory-manage-select"
                  onChange={(e) => setgender(e.target.value)}
                  value={gender}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Missed">Missed</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label className="admin-inventory-manage-label">Size</Form.Label>
                <Form.Select
                  className="admin-inventory-manage-select"
                  onChange={(e) => setsize(e.target.value)}
                  value={size}
                >
                  <option value="">Select size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="admin-inventory-manage-row">
              <Col>
                <Form.Label className="admin-inventory-manage-label">Unit Price</Form.Label>
                <Form.Control
                  className="admin-inventory-manage-input"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setunitPrice(e.target.value)}
                  placeholder="Unit Price"
                />
              </Col>
              <Col>
                <Form.Label className="admin-inventory-manage-label">Available Quantity</Form.Label>
                <Form.Control
                  className="admin-inventory-manage-input"
                  type="number"
                  value={quantity}
                  onChange={(e) => setquantity(e.target.value)}
                  placeholder="Available Quantity"
                />
              </Col>
            </Row>
          </Form>
          <Button
            className="admin-inventory-manage-add-button"
            onClick={createfish}
          >
            Add Fish to Catalogue
          </Button>
        </div>
        <div className="admin-inventory-manage-table-container">
          <Table responsive="md" className="admin-inventory-manage-table">
            <thead>
              <tr>
                <th>Fish Name (Category)</th>
                <th>Gender</th>
                <th>Size</th>
                <th>Unit Price</th>
                <th>Available Quantity</th>
                <th>Remove</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {fish.map((fish) => (
                <tr key={fish._id}>
                  <td>{fish.fishCategory}</td>
                  <td>{fish.gender}</td>
                  <td>{fish.size}</td>
                  <td>${fish.unitPrice}</td>
                  <td>{fish.quantity}</td>
                  <td>
                    <button
                      className="admin-inventory-manage-remove-button"
                      onClick={() => deletefish(fish._id)}
                    >
                      <img src={assets.deleteimg} alt="delete" />
                    </button>
                  </td>
                  <td>
                    <button
                      className="admin-inventory-manage-update-button"
                      onClick={() => {
                        getFishByFishId(fish._id);
                        setModalShow(true);
                      }}
                    >
                      <img src={assets.editimg} alt="edit" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button
            className="admin-inventory-manage-download-button"
            onClick={downloadFishInventoryPDF}
          >
            📄 Download Report
          </Button>
        </div>
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="admin-inventory-manage-modal-title">
              Update Fish Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="admin-inventory-manage-modal-row">
                <Col>
                  <Form.Label className="admin-inventory-manage-modal-label">
                    Fish Category
                  </Form.Label>
                  <Form.Control
                    className="admin-inventory-manage-modal-input"
                    type="text"
                    value={fishCategory}
                    onChange={(e) => setfishCategory(e.target.value)}
                    placeholder="Fish category (e.g., Fighter)"
                  />
                </Col>
                <Col>
                  <Form.Label className="admin-inventory-manage-modal-label">
                    Gender
                  </Form.Label>
                  <Form.Select
                    className="admin-inventory-manage-modal-select"
                    value={gender}
                    onChange={(e) => setgender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Missed">Missed</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label className="admin-inventory-manage-modal-label">
                    Size
                  </Form.Label>
                  <Form.Select
                    className="admin-inventory-manage-modal-select"
                    value={size}
                    onChange={(e) => setsize(e.target.value)}
                  >
                    <option value="">Select size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row className="admin-inventory-manage-modal-row">
                <Col>
                  <Form.Label className="admin-inventory-manage-modal-label">
                    Unit Price
                  </Form.Label>
                  <Form.Control
                    className="admin-inventory-manage-modal-input"
                    value={unitPrice}
                    onChange={(e) => setunitPrice(parseFloat(e.target.value))}
                    placeholder="Unit Price"
                  />
                </Col>
                <Col>
                  <Form.Label className="admin-inventory-manage-modal-label">
                    Available Quantity
                  </Form.Label>
                  <Form.Control
                    className="admin-inventory-manage-modal-input"
                    type="number"
                    value={quantity}
                    onChange={(e) => setquantity(parseFloat(e.target.value))}
                    placeholder="Available Quantity"
                  />
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="admin-inventory-manage-modal-update-button"
              onClick={updateFish}
            >
              Update
            </Button>
            <Button
              className="admin-inventory-manage-modal-close-button"
              onClick={() => setModalShow(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default InventoryManage;