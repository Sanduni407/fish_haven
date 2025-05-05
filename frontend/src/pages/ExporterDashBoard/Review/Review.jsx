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
    const [reviews, setReviews] = useState([]);
    const { token } = useContext(AppContext);
    const [review, setReview] = useState('');
    const [updatedReview, setUpdatedreview] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [id, setSelectedId] = useState('');

    const fetchReviews = async () => {
        try {
            const response = await axios.post(`http://localhost:4000/api/employee/review-by-userid`, {}, { headers: { token } });
            if (response.data.success) {
                setReviews(response.data.reviews);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchReviews();
    }, []);

    const createReview = async () => {
        try {
            const response = await axios.post(`http://localhost:4000/api/employee/create-review`, { review }, { headers: { token } });
            if (response.data.success) {
                alert('Successfully submitted');
                fetchReviews();
                setReview('');
            }
        } catch (err) {
            console.log(err);
        }
    }

    const deleteReview = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/employee/delete-review/${id}`);
            if (response.data.success) {
                fetchReviews();
                setReview('');
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getaReview = async (id) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/employee/get-review-by-id/${id}`);
            if (response.data.success) {
                setSelectedId(response.data.review._id);
                setUpdatedreview(response.data.review.review);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateReview = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/api/employee/update-review/${id}`, { review: updatedReview });
            if (response.data.success) {
                fetchReviews();
                setModalShow(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="exporter-post-review-container">
            <SideNavBar role="Exporter" />
            <div className="exporter-post-review-content">
                <h2 className="exporter-post-review-title">Share Your Feedback</h2>
                <Card className="exporter-post-review-card">
                    <Card.Body>
                        <Card.Title className="exporter-post-review-card-title">My Experience with Fish Haven</Card.Title>
                        <Form.Label className="exporter-post-review-label">Your Review</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your thoughts about our services..."
                            className="exporter-post-review-textarea"
                        />
                        <div className="exporter-post-review-button-container">
                            <Button className="exporter-post-review-post-button" onClick={createReview}>
                                Submit Review
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
                <div className="exporter-post-review-previous">
                    <h5 className="exporter-post-review-previous-title">My Previous Reviews</h5>
                    {reviews.length > 0 ? (
                        reviews.map((r, index) => (
                            <Card className="exporter-post-review-item" key={index}>
                                <Card.Body>
                                    <Card.Text className="exporter-post-review-item-text">{r.review}</Card.Text>
                                    <div className="exporter-post-review-item-info">
                                        <small>{r.date} at {r.time}</small>
                                        <small>Business: {r.businessName}</small>
                                    </div>
                                    <div className="exporter-post-review-item-actions">
                                        <Button 
                                            className="exporter-post-review-edit-button" 
                                            onClick={() => { getaReview(r._id); setModalShow(true); }}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            className="exporter-post-review-delete-button" 
                                            onClick={() => deleteReview(r._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className="exporter-post-review-no-reviews">No reviews posted yet. Share your first review above!</p>
                    )}
                </div>
                <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="exporter-post-review-modal-title">Edit Your Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="exporter-post-review-modal-form">
                            <Row>
                                <Form.Label className="exporter-post-review-label">Review</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={updatedReview}
                                    onChange={(e) => setUpdatedreview(e.target.value)}
                                    className="exporter-post-review-textarea"
                                />
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            className="exporter-post-review-modal-edit-button" 
                            onClick={updateReview}
                        >
                            Save Changes
                        </Button>
                        <Button 
                            className="exporter-post-review-modal-close-button" 
                            onClick={() => setModalShow(false)}
                        >
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default Review