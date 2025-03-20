import express from 'express'
import { createDelivery,getAllDeliveries ,deleteDelivery ,fetchaDeliveryByDeliveryId,updateDelivery  } from '../controllers/deliveryController.js';
import { assignVehicle, deleteVehicle, filterAssignedVehicles, getAllVehicle, getVehicleById, updateAssignedVehicle } from '../controllers/assignVehicleController.js';

const deliveryRoute = express.Router();

deliveryRoute.post('/create-delivery',createDelivery);
deliveryRoute.get('/get-deliveries',getAllDeliveries );
deliveryRoute.delete('/delete-delivery/:selectedRowId',deleteDelivery );
deliveryRoute.get('/fetch-a-delivery/:id',fetchaDeliveryByDeliveryId );
deliveryRoute.put('/update-a-delivery/:id',updateDelivery );

deliveryRoute.post('/assign-a-vehicle',assignVehicle );
deliveryRoute.get('/get-all-vehicle',getAllVehicle );
deliveryRoute.get('/filter-vehicles/:date',filterAssignedVehicles);
deliveryRoute.put('/update-assign-vehicle/:id',updateAssignedVehicle);
deliveryRoute.get('/get-vehicle/:id',getVehicleById);
deliveryRoute.delete('/delete-vehicle/:id',deleteVehicle);


export default deliveryRoute; 