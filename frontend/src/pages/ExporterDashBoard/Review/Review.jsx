import React, { useContext, useEffect, useState } from 'react'
import './Review.css'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { AppContext } from '../../../context/AppContext';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

const Review = () => {

    const[reviews, setReviews] = useState([]);

    const {token} = useContext(AppContext)

   const[review, setReview] = useState('')

   const[updatedReview,setUpdatedreview] = useState('')

   const [modalShow, setModalShow] = useState(false);

   const[id,setSelectedId] = useState('');

    const fetchReviews = async() =>{
        try{

            const response = await axios.post(`http://localhost:4000/api/employee/review-by-userid`,{},{headers:{token}});

            if(response.data.success)
            {
                setReviews(response.data.reviews);
                
            }

        }catch(err)
        {
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchReviews()
    },[])



    const createReview = async() =>{
        try{

            const response = await axios.post(`http://localhost:4000/api/employee/create-review`,{review},{headers:{token}});

            if(response.data.success)
            {
               console.log('Successfully submitted')
               alert('Successfully submitted')
               fetchReviews()
               setReview('')
            }

        }catch(err)
        {
            console.log(err);
        }
    }
   


    const deleteReview = async(id) =>{
        try{

            const response = await axios.delete(`http://localhost:4000/api/employee/delete-review/${id}`);

            if(response.data.success)
            {
               
               fetchReviews()
               setReview('')
            }

        }catch(err)
        {
            console.log(err);
        }
    }
   

    const getaReview = async(id) =>{
        try{

            const response = await axios.get(`http://localhost:4000/api/employee/get-review-by-id/${id}`);

            if(response.data.success)
            {
                setSelectedId(response.data.review._id)
                setUpdatedreview(response.data.review.review)
            }

        }catch(err)
        {
            console.log(err);
        }
    }
   

    const updateReview = async() =>{
        try{

            const response = await axios.put(`http://localhost:4000/api/employee/update-review/${id}`,{review:updatedReview});

            if(response.data.success)
            {
              
              fetchReviews()
              setModalShow(false)
             
            }

        }catch(err)
        {
            console.log(err);
        }
    }




  return (
    <div className="post-review-container">
      <div className="left-column">

       <SideNavBar role={'Exporter'} />

      </div>

      <div className="right-column">
  <div className="review-content-wrapper">
    <Card className="review-card">
      <Card.Body>
        <Card.Title>My Experience with Fish Haven</Card.Title>
        <Form.Label>Review :</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here..."
        />
        <div className="d-flex justify-content-end mt-3">
          <Button className="post-button" onClick={createReview}>
            Post
          </Button>
        </div>
      </Card.Body>
    </Card>

    <div className="previous-reviews">
      <h5>My Previous Reviews</h5>
      {reviews.length > 0 ? (
  reviews.map((r, index) => (
    <Card className="review-item" style={{ width: '70vw' }} key={index}>
      <Card.Body>
        <Card.Text>{r.review}</Card.Text>
        <div className="d-flex justify-content-between mb-2">
          <small>{r.date} at {r.time}</small>
          <small>Business name: {r.businessName}</small>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <Button variant="outline-success" size="sm" style={{width:'80px'}} className="edit-btn" onClick={()=>{getaReview(r._id); setModalShow(true);}} >Edit</Button>
          <Button variant="outline-danger" size="sm"  style={{width:'80px'}} className="delete-btn" onClick={()=>{deleteReview(r._id)}}> Delete  </Button>
        </div>
      </Card.Body>
    </Card>
  ))
) : (
  <p className="no-reviews-text">You haven’t posted any reviews yet.</p>
)}
    </div>
  </div>
</div>







 <Modal show={modalShow} onHide={()=>{setModalShow(false)}} centered>
          <Modal.Header closeButton>
            <Modal.Title style={{color:'#49557e'}}>Edit Review </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form style={{marginTop:'30px'}}>
        <Row>
        <Form.Label>Review :</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={updatedReview}
          onChange={(e) => setUpdatedreview(e.target.value)}
          
        />
          </Row>

      </Form>  
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" style={{backgroundColor:'#49557e', color:'white', width:"200px"}} onClick={updateReview}>
              Edit
            </Button>
          </Modal.Footer>
        </Modal>
  


   
      
    </div>
  )
}

export default Review