import React, { useEffect, useState } from 'react'
import './ViewEmpSalary.css'
import SideNavBar from '../../../components/SideNavBar/SideNavBar'
import axios from 'axios';
import { Table, Form, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { assets } from '../../../assets/assets'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ViewEmpSalary = () => {
    const [employee, setEmployee] = useState([]);
    const [name, setName] = useState('');
    const [basicPay, setbasicPay] = useState(0);
    const [presentDays, setpresentDays] = useState(0);
    const [calculatedSalary, setcalculatedSalary] = useState(0);
    const [modalShow, setModalShow] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [search, setSearch] = useState('');

    const fetchAllData = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/employee/get-all-salary?searchText=${search}`)
            if (response.data.success) {
                setEmployee(response.data.employees)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetchARecord = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/employee/get-salary-record/${selectedId}`)
            if (response.data.success) {
                const record = response.data.salaryrecord;
                setName(record.name);
                setbasicPay(record.basicPay);
                setpresentDays(record.presentDays);
                setcalculatedSalary(record.calculatedSalary);
            }
        } catch (err) {
            console.log(err)
        }
    }

    const generateSalarySlip = async (employeeId) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/employee/get-salary-record/${employeeId}`);
            if (response.data.success) {
                const employee = response.data.salaryrecord;
                const doc = new jsPDF();
                const pageWidth = doc.internal.pageSize.getWidth();
                const margin = 10;
                
                // Draw border
                doc.setDrawColor(0);
                doc.setLineWidth(0.5);
                doc.rect(margin, margin, pageWidth - margin * 2, 270);
                
                // Company header
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Fish Haven", margin + 2, 18);
                
                // Generated date
                const generatedAt = new Date().toLocaleString();
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.text(`Generated on: ${generatedAt}`, margin + 2, 25);
                
                // Title
                doc.setFontSize(18);
                doc.setFont("helvetica", "bold");
                doc.text("Salary Slip", pageWidth / 2, 40, { align: "center" });
                
                // Employee details
                doc.setFontSize(12);
                doc.setFont("helvetica", "normal");
                doc.text(`Employee Name: ${employee.name}`, margin + 2, 55);
                doc.text(`Employee ID: ${employee._id}`, margin + 2, 63);
                doc.text(`Basic Pay: LKR ${employee.basicPay.toFixed(2)}`, margin + 2, 71);
                doc.text(`Present Days: ${employee.presentDays}`, margin + 2, 79);
                
                // Salary calculation details
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Salary Calculation", pageWidth / 2, 95, { align: "center" });
                
                // Salary table
                const salaryData = [
                    ["Description", "Amount (LKR)"],
                    ["Basic Salary", employee.basicPay.toFixed(2)],
                    ["Days Worked", employee.presentDays],
                    ["Total Salary", employee.calculatedSalary.toFixed(2)]
                ];
                
                autoTable(doc, {
                    head: [salaryData[0]],
                    body: salaryData.slice(1),
                    startY: 105,
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
                
                // Footer note
                doc.setFontSize(10);
                doc.setFont("helvetica", "italic");
                doc.text("This is a computer generated document. No signature required.", 
                        pageWidth / 2, 260, { align: "center" });
                
                // Save the PDF
                const fileName = `Salary_Slip_${employee.name.replace(/\s+/g, '_')}.pdf`;
                doc.save(fileName);
            }
        } catch (err) {
            console.error("Error generating salary slip:", err);
            alert("Failed to generate salary slip");
        }
    };

    useEffect(() => {
        fetchAllData()
    }, [])

    useEffect(() => {
        fetchAllData()
    }, [search])

    useEffect(() => {
        if (selectedId) {
            fetchARecord()
        }
    }, [selectedId])

    const updateDetails = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/api/employee/update-salary`, { id: selectedId, basicPay, presentDays, calculatedSalary })
            if (response.data.success) {
                console.log("Successfully updated")
                fetchAllData()
                setModalShow(false)
            }
        } catch (err) {
            console.log("update details function is not working")
        }
    }

    const handleAttendanceChange = async (empId, status) => {
        try {
            const response = await axios.post(`http://localhost:4000/api/employee/mark-attendance`, { empId, status })
            if (response.data.success) {
                console.log("Successfully updated")
                fetchAllData()
            }
        } catch (err) {
            console.log("update details function is not working")
        }
    }

    return (
        <div className="admin-view-emp-salary-container">
            <SideNavBar role="Admin" />
            <div className="admin-view-emp-salary-content">
                <h2 className="admin-view-emp-salary-title">Manage Employee Salaries</h2>
                <div className="admin-view-emp-salary-search-container">
                    <img src={assets.search} alt="search" className="admin-view-emp-salary-search-icon" />
                    <Form.Control
                        className="admin-view-emp-salary-search-input"
                        placeholder="Search employees..."
                        type="search"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="admin-view-emp-salary-table-container">
                    <Table className="admin-view-emp-salary-table">
                        <thead>
                            <tr>
                                <th className="admin-view-emp-salary-th-emp-id">Emp ID</th>
                                <th className="admin-view-emp-salary-th-name">Employee Name</th>
                                <th className="admin-view-emp-salary-th-basic-pay">Basic Pay</th>
                                <th className="admin-view-emp-salary-th-present-days">Present Days</th>
                                <th className="admin-view-emp-salary-th-today-status">Today's Status</th>
                                <th className="admin-view-emp-salary-th-calculated-salary">Calculated Salary</th>
                                <th className="admin-view-emp-salary-th-update"></th>
                                <th className="admin-view-emp-salary-th-generate-slip"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {employee.map((request, index) => (
                                <tr key={index}>
                                    <td>#{index}</td>
                                    <td>{request.name}</td>
                                    <td>LKR {request.basicPay}</td>
                                    <td>{request.presentDays}</td>
                                    <td>
                                        <Form.Select
                                            className="admin-view-emp-salary-status-select"
                                            value=""
                                            onChange={(e) => handleAttendanceChange(request._id, e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                        </Form.Select>
                                    </td>
                                    <td>LKR {request.calculatedSalary}</td>
                                    <td>
                                        <Button
                                            className="admin-view-emp-salary-update-button"
                                            onClick={() => { setSelectedId(request._id); setModalShow(true); }}
                                        >
                                            <img src={assets.editimg} alt="edit" />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button 
                                            className="admin-view-emp-salary-generate-button"
                                            onClick={() => generateSalarySlip(request._id)}
                                        >
                                            <img src={assets.downloadimg} alt="download" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                    <Modal.Header closeButton className="admin-view-emp-salary-modal-header">
                        <Modal.Title className="admin-view-emp-salary-modal-title">Update Employee Salary Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="admin-view-emp-salary-modal-body">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="admin-view-emp-salary-modal-label">Employee Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    readOnly
                                    className="admin-view-emp-salary-modal-input"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="admin-view-emp-salary-modal-label">Basic Pay</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={basicPay}
                                    onChange={(e) => setbasicPay(parseFloat(e.target.value))}
                                    className="admin-view-emp-salary-modal-input"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="admin-view-emp-salary-modal-label">Present Days</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={presentDays}
                                    onChange={(e) => setpresentDays(parseFloat(e.target.value))}
                                    className="admin-view-emp-salary-modal-input"
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="admin-view-emp-salary-modal-label">Calculated Salary</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={calculatedSalary}
                                    onChange={(e) => setcalculatedSalary(parseFloat(e.target.value))}
                                    className="admin-view-emp-salary-modal-input"
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end">
                                <Button
                                    className="admin-view-emp-salary-modal-update-button"
                                    onClick={updateDetails}
                                >
                                    Update
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    )
}

export default ViewEmpSalary