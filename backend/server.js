import express from "express";
import cors from "cors";
import 'dotenv/config';

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import orderRouter from "./routes/OrderRoute.js";
import deliveryRoute from "./routes/deliveryRoute.js";

const app = express();
const port = process.env.PORT || 5001

connectDB();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("API Working") 
})

app.use('/api/auth', authRouter)

app.use('/api/order',orderRouter)

app.use("/api/delivery",deliveryRoute)


app.listen(port, ()=>{
    console.log(`Server started on PORT:${port}`)
});

