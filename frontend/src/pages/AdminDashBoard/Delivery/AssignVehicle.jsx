import React, { useEffect, useState } from 'react'
import './AssignVehicle.css'
import { useParams } from 'react-router-dom'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SideNavBar from '../../../components/SideNavBar/SideNavBar';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import {assets} from '../../../assets/assets'

const AssignVehicle = () => {
     
    const{id} = useParams()

    const [userId, setUserId] = useState("");
    const [date, setDate] = useState("");
    const [vehicle, setvehicle] = useState("");
    const [time, setTime] = useState("");
    const [ delCode, setdelCode] = useState("");
    const [status , setStatus] = useState('')

    const [searchDate, setSearchDate] = useState("");

    const [selectedId, setselectedId] = useState('')

     const [modalShow, setModalShow] = useState(false);

    const [asignedVehicles, setAssignedVehicles] = useState([])

    const fetchData = async()=>{
        try{
            const response = await axios.get(`http://localhost:4000/api/delivery/fetch-a-delivery/${id}`);
            if(response.data.success)
            {
              const delivery = response.data.deliveryRecord;
                setUserId(delivery.userId)
                setdelCode(delivery.delCode)
                setDate(delivery.deliveryDate)
            }
        }catch(err)
        {
            console.log(err)
        }
    }

    const AsssignAvehicle = async()=>{
        try{
            const response = await axios.post(`http://localhost:4000/api/delivery/assign-a-vehicle`,{userId,date,vehicle,time,delCode});
            if(response.data.success)
            {
             console.log("vehicle is assigned successfully")
             toast.success('successfully assigned')
             getAllDetails()
            }
        }catch(err)
        {
            console.log(err)
        }
    }

    const getAllDetails = async()=>{
        try{
            const response = await axios.get(`http://localhost:4000/api/delivery/get-all-vehicle?searchText=${searchDate}`);
            if(response.data.success)
            {
                setAssignedVehicles(response.data.assignVehicles)
            }
        }catch(err)
        {
            console.log(err)
        }
    }

    useEffect(()=>{
        fetchData();
        getAllDetails();
    },[])

    useEffect(()=>{
      getAllDetails()
    },[searchDate])

    const fetchAssignedData= async(id)=>{
        try{
            const response = await axios.get(`http://localhost:4000/api/delivery/get-vehicle/${id}`);
            if(response.data.success)
            {
              const vehicle = response.data.vehicleRecode;
                setDate(vehicle.date)
                setStatus(vehicle.status)
                setTime(vehicle.time)
                setvehicle(vehicle.vehicle)
                setdelCode(vehicle.delCode)
                setselectedId(vehicle._id)
            }
        }catch(err)
        {
            console.log(err)
        }
    }

    const update = async()=>{
        try{
            const response = await axios.put(`http://localhost:4000/api/delivery/update-assign-vehicle/${selectedId}`,{vehicle,time,status});
            if(response.data.success)
            {
                console.log('updated successfully')
                toast.success('Vehicle details changed successfully')
                getAllDetails()
                setModalShow(false);
            }
        }catch(err)
        {
            console.log(err)
        }
    }

    const Delete = async()=>{
        try{
            const response = await axios.delete(`http://localhost:4000/api/delivery/delete-vehicle/${selectedId}`);
            if(response.data.success)
            {
                console.log('successfully deleted')
                toast.success('Record removed successfully')
                getAllDetails()
            }
        }catch(err)
        {
            console.log(err)
        }
    }

    return (
      <div className="admin-assign-vehicle-container">
        <SideNavBar role="Admin" />
        <div className="admin-assign-vehicle-content">
          <h2 className="admin-assign-vehicle-title">Assign Vehicle</h2>
          <div className="admin-assign-vehicle-form">
            <Form>
              <Row className="admin-assign-vehicle-row">
                <Col>
                  <Form.Label className="admin-assign-vehicle-label">Delivery Code</Form.Label>
                  <Form.Control
                    className="admin-assign-vehicle-input"
                    placeholder="Delivery code"
                    value={delCode}
                    readOnly
                  />
                </Col>
                <Col>
                  <Form.Label className="admin-assign-vehicle-label">Shipment Date</Form.Label>
                  <Form.Control
                    className="admin-assign-vehicle-input"
                    placeholder="Shipment date"
                    value={date}
                    readOnly
                  />
                </Col>
                <Col>
                  <Form.Label className="admin-assign-vehicle-label">Vehicle No</Form.Label>
                  <Form.Select
                    className="admin-assign-vehicle-select"
                    onChange={(e) => setvehicle(e.target.value)}
                    value={vehicle}
                    required
                  >
                    <option value="">Assign a vehicle</option>
                    <option value="CXX-2316">CXX-2316</option>
                    <option value="DBR-2456">DBR-2456</option>
                    <option value="CAA-1516">CAA-1516</option>
                    <option value="KA-2342">KA-2342</option>
                    <option value="CAZ-1003">CAZ-1003</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label className="admin-assign-vehicle-label">Time</Form.Label>
                  <Form.Control
                    className="admin-assign-vehicle-input"
                    placeholder="Time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </Col>
              </Row>
            </Form>
            <Button
              className="admin-assign-vehicle-place-button"
              onClick={AsssignAvehicle}
            >
              Assign Vehicle
            </Button>
          </div>
          <Form>
            <Form.Control
              className="admin-assign-vehicle-search-input"
              placeholder="Search by date"
              type="date"
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </Form>
          <div className="admin-assign-vehicle-table-container">
            <Table responsive="md" className="admin-assign-vehicle-table">
              <thead>
                <tr>
                  <th>Delivery Code</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Delivery Status</th>
                  <th>Update</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {asignedVehicles.map((item, index) => (
                  <tr key={index}>
                    <td>{item.delCode}</td>
                    <td>{item.vehicle}</td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>{item.status}</td>
                    <td>
                      <button
                        className="admin-assign-vehicle-update-button"
                        onClick={() => {
                          setselectedId(item._id);
                          fetchAssignedData(item._id);
                          setModalShow(true);
                        }}
                      >
                        <img src={assets.editimg} alt="edit" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="admin-assign-vehicle-delete-button"
                        onClick={() => {
                          setselectedId(item._id);
                          Delete();
                        }}
                      >
                        <img src={assets.deleteimg} alt="delete" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title className="admin-assign-vehicle-modal-title">Update Vehicle Assign Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row className="admin-assign-vehicle-modal-row">
                  <Col>
                    <Form.Label className="admin-assign-vehicle-modal-label">Delivery Code</Form.Label>
                    <Form.Control
                      className="admin-assign-vehicle-modal-input"
                      placeholder="Delivery code"
                      value={delCode}
                      readOnly
                    />
                  </Col>
                  <Col>
                    <Form.Label className="admin-assign-vehicle-modal-label">Shipment Date</Form.Label>
                    <Form.Control
                      className="admin-assign-vehicle-modal-input"
                      placeholder="Shipment date"
                      value={date}
                      readOnly
                    />
                  </Col>
                </Row>
                <Row className="admin-assign-vehicle-modal-row">
                  <Col>
                    <Form.Label className="admin-assign-vehicle-modal-label">Vehicle No</Form.Label>
                    <Form.Select
                      className="admin-assign-vehicle-modal-select"
                      value={vehicle}
                      onChange={(e) => setvehicle(e.target.value)}
                    >
                      <option value="">Assign a vehicle</option>
                      <option value="CXX-2316">CXX-2316</option>
                      <option value="DBR-2456">DBR-2456</option>
                      <option value="CAA-1516">CAA-1516</option>
                      <option value="KA-2342">KA-2342</option>
                      <option value="CAZ-1003">CAZ-1003</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Label className="admin-assign-vehicle-modal-label">Time</Form.Label>
                    <Form.Control
                      className="admin-assign-vehicle-modal-input"
                      placeholder="Time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Label className="admin-assign-vehicle-modal-label">Status</Form.Label>
                    <Form.Select
                      className="admin-assign-vehicle-modal-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value=""></option>
                      <option value="Assigned">Assigned</option>
                      <option value="Out-for-delivery">Out-for-delivery</option>
                      <option value="Delivered">Delivered</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="admin-assign-vehicle-modal-update-button"
                onClick={update}
              >
                Update Vehicle
              </Button>
              <Button
                className="admin-assign-vehicle-modal-close-button"
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

export default AssignVehicle