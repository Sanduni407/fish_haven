import React, { useContext, useEffect, useState } from 'react';
import './AddFish.css';
import SideNavBar from '../../../components/SideNavBar/SideNavBar';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {assets} from '../../../assets/assets';

const AddFish = () => {
  const { token } = useContext(AppContext);
  const [modalShow, setModalShow] = useState(false);

  const[image,setImage] = useState(false)
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

    // Ensure unit price is positive
    if (unitPrice <= 0) {
      toast.error('Unit price must be a positive number!');
      return false;
    }

    // Ensure quantity is positive
    if (quantity <= 0) {
      toast.error('Quantity must be a positive number!');
      return false;
    }

    return true;
  };

  const createfish = async () => {
    // Validate before submitting
    if (!validateForm()) return;

    try {

      const formData = new FormData();

      formData.append("fishCategory",fishCategory)
      formData.append("gender",gender)
      formData.append("size",size)
      formData.append("unitPrice",unitPrice)
      formData.append("quantity",quantity)
      formData.append("image",image)


      const response = await axios.post('http://localhost:4000/api/fish/create-fish',
          formData
         ,{headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message);
        getFishById();

          setfishCategory("")
          setgender('')
          setsize('')
          setunitPrice(0)
          setquantity(0)
          setImage(false)
      }
    } catch (err) {
      console.log(err);
      toast.error('Error creating fish');
    }
  };

  const getFishById = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/fish/getfishById', {}, { headers: { token } });

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
    
    if (!validateForm()) return;

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
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFishById();
  }, []);

  return (
    <div className="supplier-add-fish-container">
      <div className="left-column">
        <SideNavBar role="Supplier" />
      </div>
      <div className="right-column">
        <Form style={{ marginTop: '30px' }}>

          
        <Row>
        <Form.Label htmlFor='image'>
            <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
        </Form.Label>

        <Form.Control onChange={(e)=>setImage(e.target.files[0])}   type='file' id='image' hidden required/>

        </Row>
        
          <Row>
            <Col>
              <Form.Control
                type="text"
                onChange={(e) => setfishCategory(e.target.value)}
                placeholder="fish name (fish category ex-: fighter)"
              />
            </Col>
            <Col>
              <Form.Select onChange={(e) => setgender(e.target.value)} placeholder="gender">
                <option>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Missed">Missed</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Select onChange={(e) => setsize(e.target.value)} placeholder="fish size">
                <option>Select size</option>
                <option value="small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control
                type="number"
                onChange={(e) => setunitPrice(parseFloat(e.target.value))}
                placeholder="Unit Price"
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                onChange={(e) => setquantity(parseFloat(e.target.value))}
                placeholder="Available Quantity"
              />
            </Col>
          </Row>
        </Form>

        <center>
          <button
            className="btnadd"
            onClick={createfish}
            style={{
              width: '200px',
              backgroundColor: '#1e194d',
              color: 'white',
              marginBottom: '30px',
              marginTop: '20px',
            }}
          >
            + Add Fish to Catalogue
          </button>
        </center>

        <div className="table-style">
          <table>
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
                      style={{ backgroundColor: '#a93226', color: 'white' }}
                      onClick={() => deletefish(fish._id)}
                    >
                      Remove
                    </button>
                  </td>
                  <td>
                    <button
                      style={{ backgroundColor: '#16a085', color: 'white' }}
                      onClick={() => {
                        getFishByFishId(fish._id);
                        setModalShow(true);
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Fish Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{ marginTop: '30px' }}>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  value={fishCategory}
                  onChange={(e) => setfishCategory(e.target.value)}
                  placeholder="fish name (fish category ex-: fighter)"
                />
              </Col>
              <Col>
                <Form.Select value={gender} onChange={(e) => setgender(e.target.value)} placeholder="gender">
                  <option>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Missed">Missed</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Select value={size} onChange={(e) => setsize(e.target.value)} placeholder="fish size">
                  <option>Select size</option>
                  <option value="small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setunitPrice(parseFloat(e.target.value))}
                  placeholder="Unit Price"
                />
              </Col>
              <Col>
                <Form.Control
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
          <Button variant="secondary" style={{ backgroundColor: '#16a085' }} onClick={updateFish}>
            Update
          </Button>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddFish;
