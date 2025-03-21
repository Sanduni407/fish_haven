
import React, { useContext, useEffect } from 'react'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import SideNavBar from '../../../components/SideNavBar/SideNavBar';

const InventoryManage = () => {

    const{token} = useContext(AppContext)

    const [modalShow, setModalShow] = useState(false);
  
    const [fishCategory,setfishCategory] = useState('');
    const [gender,setgender] = useState('');
    const [size,setsize] = useState('');
    const [unitPrice,setunitPrice] = useState(0);
    const [quantity,setquantity] = useState(0);
  
    const[fish,setFish] = useState([]);
  
    const [id,setId] = useState('')
  
  
  
  
    const createfish = async()=>{
  
      try{
         const response = await axios.post('http://localhost:4000/api/fish/create-fish',{
          fishCategory,gender,size,unitPrice,quantity
         },{headers:{token}})
  
         if(response.data.success)
         {
          toast.success(response.data.message);
          getFishById();
  
         }
         
      }catch(err)
      {
          console.log(err);
          toast.error(response.data.message);
      }
      
  }
  
  const getFishById = async()=>{
  
    try{
       const response = await axios.post('http://localhost:4000/api/fish/getfishById',{},{headers:{token}});
  
       if(response.data.success)
       {
        setFish(response.data.fishes)
        
  
       }
       
    }catch(err)
    {
        console.log(err);
        toast.error('Error');
    }
    
  }
  
  useEffect(()=>{
    getFishById();
  },[])
  
  
  const deletefish = async(id)=>{
    try{
  
      const response = await axios.delete(`http://localhost:4000/api/fish/delete-fish/${id}`);
  
       if(response.data.success)
       {
          toast.success('Successfully deleted')
          getFishById();
       }
       
    }catch(err)
    {
      console.log(err)
    }
  }
  
  
  const getFishByFishId = async (id)=>{
  
    try{
  
      const response = await axios.get(`http://localhost:4000/api/fish/get-fish-id/${id}`);
  
       if(response.data.success)
       {
          
        const fish = response.data.fish;
         
        setId(fish._id)
        setfishCategory(fish.fishCategory)
        setgender(fish.gender)
        setsize(fish.size)
        setquantity(fish.quantity)
        setunitPrice(fish.unitPrice)
       }
       
    }catch(err)
    {
      console.log(err)
    }
  
  }
  
  const updateFish = async()=>{
    try{
  
      const response = await axios.put(`http://localhost:4000/api/fish/update-fish/${id}`,{fishCategory,gender,size,quantity,unitPrice});
  
       if(response.data.success)
       {
          console.log('fish updated successfully')
          getFishById()
          setModalShow(false)
       }
       
    }catch(err)
    {
      console.log(err)
    }
  }
    return (
      <div className="supplier-add-fish-container">
    <div className="left-column">
      <SideNavBar role={"Admin"}/>
    </div>
    <div className="right-column">
  
    <Form style={{marginTop:'30px'}}>
        <Row>
        <Col>
            <Form.Control type='text' onChange={(e)=>{setfishCategory(e.target.value)}} placeholder='fish name (fish category ex-: fighter'/>
          </Col>
  
          <Col>
            <Form.Select  onChange={(e)=>{setgender(e.target.value)}} placeholder='gender'>
            <option>Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Missed">Missed</option>
              </Form.Select>
            
          </Col>
          <Col>
            <Form.Select   onChange={(e)=>{setsize(e.target.value)}} placeholder='fish size'>
            <option>Select size</option>
            <option value="small">small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
              </Form.Select>
            
          </Col>
         
        </Row>
        <Row> 
          <Col>
            <Form.Control onChange={(e)=>{setunitPrice(parseFloat(e.target.value))}} placeholder='Unit Price'/>
          </Col>
        <Col>
            <Form.Control type='Number' onChange={(e)=>{setquantity(parseFloat(e.target.value))}} placeholder='Available Quantity'/>
          </Col>   
        </Row>
      </Form>  
      
      <center>  <button className='btnadd' onClick={createfish} style={{width:'200px',backgroundColor:'#1e194d',color:'white',marginBottom:'30px',marginTop:'20px'}}>+ Add Fish to Catalogue</button></center>
  
  
  
     
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
  
        {fish.map((fish,index)=>(
        <tr key={index}>
          <td>{fish.fishCategory}</td>
          <td>{fish.gender}</td>
          <td>{fish.size}</td>
          <td>${fish.unitPrice}</td>
          <td>{fish.quantity}</td>
          <td ><button style={{backgroundColor:'#a93226' , color:'white'}} onClick={()=>{deletefish(fish._id)}}>Remove</button> </td>
          <td ><button style={{backgroundColor:'#16a085 ' , color:'white'}} onClick={()=>{ getFishByFishId(fish._id); setModalShow(true)}}>Update</button> </td>
      </tr>
      ))}
        </tbody>
        </table>
  
  </div>
  
      
    </div>
  
     <Modal show={modalShow} onHide={()=>{setModalShow(false)}} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Fish Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form style={{marginTop:'30px'}}>
        <Row>
        <Col>
            <Form.Control type='text' value={fishCategory} onChange={(e)=>{setfishCategory(e.target.value)}} placeholder='fish name (fish category ex-: fighter'/>
          </Col>
  
          <Col>
            <Form.Select  value={gender} onChange={(e)=>{setgender(e.target.value)}} placeholder='gender'>
            <option>Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Missed">Missed</option>
              </Form.Select>
            
          </Col>
          <Col>
            <Form.Select  value={size} onChange={(e)=>{setsize(e.target.value)}} placeholder='fish size'>
            <option>Select size</option>
            <option value="small">small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
              </Form.Select>
            
          </Col>
         
        </Row>
        <Row> 
          <Col>
            <Form.Control value={unitPrice} onChange={(e)=>{setunitPrice(parseFloat(e.target.value))}} placeholder='Unit Price'/>
          </Col>
        <Col>
            <Form.Control type='Number' value={quantity} onChange={(e)=>{setquantity(parseFloat(e.target.value))}} placeholder='Available Quantity'/>
          </Col>   
        </Row>
      </Form>  
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" style={{backgroundColor:'#16a085'}} onClick={updateFish}>
              Update
            </Button>
            <Button variant="secondary" onClick={()=> setModalShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
  
  </div>
  
    )
}

export default InventoryManage