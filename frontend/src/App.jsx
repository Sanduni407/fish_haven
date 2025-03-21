import React from 'react'
import { Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import ExporterRegisterForm from './pages/ExporterRegisterForm/ExporterRegisterForm'
import ExporterDashBoard from './pages/ExporterDashBoard/ExporterDashBoard'
import AdminDashBoard from './pages/AdminDashBoard/AdminDashBoard'
import PasswordResetPage from './pages/PasswordResetPage/PasswordResetPage'
import{ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ViewUserAccounts from './pages/Admin/ViewUserAccounts/ViewUserAccounts'
import CreateAccForm from './pages/Admin/CreateAccForm/CreateAccForm'
import ReqRequestTable from './pages/Admin/ReqRequestTable/ReqRequestTable'
import PlaceOrder from './pages/ExporterDashBoard/Order/PlaceOrder/PlaceOrder'
import ViewOrders from './pages/ExporterDashBoard/Order/ViewOrders/ViewOrders'
import ViewOrder from './pages/AdminDashBoard/Order/ViewOrder/ViewOrder'
import UpdateOrder from './pages/ExporterDashBoard/Order/UpdateOrder/UpdateOrder';
import PlaceFarmOrders from './pages/AdminDashBoard/Order/PlaceFarmOrders/PlaceFarmOrders';
import AddFish from './pages/SupplierDashboard/AddFish/AddFish';
import ViewOrderRequest from './pages/SupplierDashboard/ViewOrderRequest/ViewOrderRequest';
import CreateDelivery from './pages/AdminDashBoard/Delivery/CreateDelivery';
import ViewDelivery from './pages/AdminDashBoard/Delivery/ViewDelivery';
import UpdateDelivery from './pages/AdminDashBoard/Delivery/UpdateDelivery';
import InventoryManage from './pages/AdminDashBoard/Inventory/InventoryManage';
import Inventory from './pages/AdminDashBoard/Inventory/Inventory';
import AssignVehicle from './pages/AdminDashBoard/Delivery/AssignVehicle';
import Employeedashboard from './pages/EmployeeDashboard/Employeedashboard';
import AddLeave from './pages/EmployeeDashboard/Employee/AddLeave';
import ViewRequest from './pages/EmployeeDashboard/Employee/ViewRequest';
import ViewLeaveReq from './pages/AdminDashBoard/Employee/ViewLeaveReq';
import ViewUserProfile from './pages/ExporterDashBoard/UserProfile/ViewUserProfile';
import SupplierProfiles from './pages/SupplierDashboard/UserProfile/SupplierProfiles';
import EmployeeProfiles from './pages/EmployeeDashboard/UserProfile/EmployeeProfiles';


const App = () => {
  return (
    <div>
        <ToastContainer/>
      <Routes>


        <Route path='/' element={<Home/>}/>
        <Route path='/exporter-dashboard' element={<ExporterDashBoard/>}/>
        <Route path='/admin-dashboard' element={<AdminDashBoard/>}/>

        
        {/*Sanduni */}

        <Route path='/exporter/place-order' element={<PlaceOrder/>}/>
        <Route path='/exporter/view-order' element={<ViewOrders/>}/>
        <Route path='/exporter/update-order/:id' element={<UpdateOrder/>}/>
        <Route path='/admin/view-orders' element={<ViewOrder/>}/>
        <Route path='/admin/place-farm-orders/:orderCode' element={<PlaceFarmOrders/>}/>
        <Route path='/admin/view-farm-orders' element={<PlaceFarmOrders/>}/>
        <Route path='/supplier/view-order' element={<ViewOrderRequest/>}/>


        {/* danushi  */}
        <Route path='/login' element={<Login/>}/>
        <Route path='/exporter-register' element={<ExporterRegisterForm/>}/>
        <Route path='/password-reset' element={<PasswordResetPage/>}/>
        <Route path='/admin-users' element={<ViewUserAccounts/>}/>
        <Route path='/create-acc/:id' element={<CreateAccForm/>}/>
        <Route path='/create-acc' element={<CreateAccForm/>}/>
        <Route path='/view-requests' element={<ReqRequestTable/>}/>
        <Route path='/exporter-view-profile' element={<ViewUserProfile/>}/>
        <Route path='/supplier-view-profile' element={<SupplierProfiles/>}/>
        <Route path='/employee-view-profile' element={<EmployeeProfiles/>}/>

        {/*Minuli */}
        <Route path='/admin/create-delivery/:id' element={<CreateDelivery/>}/>
        <Route path='/admin/view-deliveries' element={<ViewDelivery/>}/>
        <Route path='/admin/update-delivery/:id' element={<UpdateDelivery/>}/>
        <Route path='/admin/assign-vehicle/:id' element={<AssignVehicle/>}/>


        {/* Sanjitha */}
        <Route path='/supplier/add-fish' element={<AddFish/>}/>
        <Route path='/admin/manage-inventory' element={<InventoryManage/>}/>
        <Route path='/view/inventory' element={<Inventory/>}/>


        

      </Routes>
    </div>
  )
}

export default App