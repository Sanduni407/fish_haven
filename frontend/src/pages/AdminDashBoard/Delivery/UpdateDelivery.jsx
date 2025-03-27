import React, { useEffect, useState } from 'react'
import './UpdateDelivery.css'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import { useNavigate, useParams } from 'react-router-dom'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const UpdateDelivery = () => {

  const {id} = useParams();

  const navigate = useNavigate();

     const predefinedPackageSizes = {
       "Betta": 5,
       "Neon tetra": 4,
       "Cod": 3,
       "Trout": 2,
       "Mackerel": 6
     };


      const [ delCode,setdelCode] = useState('')
      const[orderCode, setOrderCode] = useState('');
      const[shippingAddress, setshippingAddress] = useState('');
      const[ deliveryDate, setdeliveryDate] = useState('');
      const[ orderType, setorderType] = useState('');
      const[ contact, setcontact] = useState('');
      const[PackagingArray,setPackagingArray] = useState([]);

       const[ fishCategory, setfishCategory] = useState([]);

        const[variety,setvariety] = useState('');
        const[quantity,setQuantity] = useState(0);
        const[qtyForPackage,setqtyForPackage] = useState(0);
        const[NoOfPackages,setNoOfPackages] = useState(0);
       
     

  const fetchaDelivery = async()=>{
    try{
        const response = await axios.get(`http://localhost:4000/api/delivery/fetch-a-delivery/${id}`);

        if(response.data.success)
        {
           const delivery = response.data.deliveryRecord;

           setdelCode(delivery.delCode)
           setOrderCode(delivery.orderCode)
           setshippingAddress(delivery.shippingAddress)
           setdeliveryDate(delivery.deliveryDate)
           setorderType(delivery.orderType)
           setcontact(delivery.contact)
           setPackagingArray(delivery.PackagingArray)
        }
    }catch(err)
    {
      console.log(err)
    }
  }


    const fetchAllFishCategory = async()=>{
          try{
      
            const response = await axios.get('http://localhost:4000/api/fish/get-fish-names');
      
            if(response.data.success)
            {
              setfishCategory(response.data.uniqueFishNames)
            }
            else
            {
              console.log("error")
            }
          }catch(err)
          {
            console.log(err)
          }
          
        }

        const addToCART = (newItem)=>{

          setPackagingArray(prevstate=>[...prevstate,newItem]);
          console.log(PackagingArray);
        }

  useEffect(()=>{
    fetchaDelivery();
    fetchAllFishCategory();
  },[])


   useEffect(() => {
          if (variety in predefinedPackageSizes) {
              const packageSize = predefinedPackageSizes[variety];
              setqtyForPackage(packageSize);
              if (quantity > 0) {
                  setNoOfPackages(Math.ceil(quantity / packageSize));
              }
          }
      }, [variety, quantity]);


      const updateDelivery = async()=>{
        try{
           
          const response = await axios.put(`http://localhost:4000/api/delivery/update-a-delivery/${id}`,{PackagingArray,deliveryDate});

          if(response.data.success)
          {
            console.log("updated successfully")
            navigate('/admin/view-deliveries')
          }

        }catch(err)
        {
          console.log(err)
        }
      }
  return (
    <div className="admin-update-container">
    <div className="left-column">
      <SideNavBar role="Admin"/>
    </div>
    <div className="right-column">
      <Form>
          <Row>
          <Col>
          <label>Order ID</label><br/>
              <Form.Control placeholder='Order code' value={orderCode} readOnly />
            </Col>
            <Col>
            <label>Address</label><br/>
              <Form.Control placeholder='Shipping address' value={shippingAddress} readOnly/>
            </Col>
            
    
           
          </Row>
          <Row>
          <Col>
          <label>Contact No</label><br/>
              <Form.Control placeholder="Contact number" value={contact}  readOnly/>
            </Col>
          
          <Col>
          <label>Order Type</label><br/>
              <Form.Control placeholder="Order Type" value={orderType}  readOnly/>
            </Col> 
             <Col>
             <label>Shipment Date</label><br/>
              <Form.Control placeholder='Delivery date' value={deliveryDate} type='date' onChange={(e)=>{setdeliveryDate(e.target.value)}} />
            </Col>
          </Row>
          <Row>
              <Col>
              <label>Fish Variety</label><br/>
              <Form.Select placeholder="Fish variety"  onChange={(e)=>{setvariety(e.target.value)}}required>
              <option>Select fish category</option>
              {fishCategory.map((fish,index)=>{
                return(
                    <option value={fish} key={index}>{fish}</option>
                )
               })}   
                </Form.Select>
              
            </Col>
          <Col>
          <label>Quantity</label><br/>
              <Form.Control placeholder="Quantity"  type='number'  onChange={(e)=>{setQuantity(parseFloat(e.target.value))}}/>
            </Col>
    
          
          </Row>
        </Form>
    
        <center><button type='button' className='btn-add-item' style={{width:'200px'}}
              onClick={()=>{
                          
                   const item = {
                       variety:variety,
                       quantity:quantity,
                       qtyForPackage:qtyForPackage,
                       NoOfPackages:NoOfPackages
                        }
    
               addToCART(item);
              
              
              }} >+ Assign packaging</button></center>
           
           <div className="table-style">
          <table>
          <thead>
            <tr>
              <th>Variety</th>
              <th>quantity</th>
              <th>QTY for package</th>
              <th>No of Packages</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
    
            {PackagingArray.map((item,index)=>{
              return(
              <tr key={index}>
              <td>{item.variety}</td>
              <td>{item.quantity}</td>
              <td>{item.qtyForPackage}</td>
              <td>{item.NoOfPackages}</td>
              <td><button className='btndelete'
              onClick={() => {
                setPackagingArray(PackagingArray.filter((_, i) => i !== index));
              }}
              >Delete</button></td>
            </tr>)
            })}
            
          </tbody>
          </table>
            
    
    
        </div>
    
        <center><Button variant="secondary" style={{width:'200px'}} onClick={updateDelivery}>Update Delivery</Button></center>
      </div>
      </div>
  
  )
}

export default UpdateDelivery
