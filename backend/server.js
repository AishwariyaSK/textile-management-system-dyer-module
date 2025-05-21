import express, { json } from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes.js';
import orderDetailsRoutes from './routes/orderDetailsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
connectDB()

app.use(cors({
    origin: "*",  
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'token'], 
    credentials: true 
}));
app.options('*', cors());

app.use(json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Backend started');
});

app.use('/api/user', userRoutes);
app.use('/api/purchaseOrder', purchaseOrderRoutes);
app.use('/api/orderDetail', orderDetailsRoutes);
app.use('/api/notification', notificationRoutes);


app.listen(port, () => {
    console.log("Server is running on port " + port);
});
