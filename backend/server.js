const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const admin = require('firebase-admin');
const connectDB = require('./config/db.js');
const seed = require('./utils/seed.js');
require('dotenv').config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Connect to Database
connectDB().then(() => {
  // Seed database with initial data if it's empty
  seed();
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Attach io instance to request object to be used in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/products', require('./routes/productRoutes.js'));
app.use('/api/categories', require('./routes/categoryRoutes.js'));
app.use('/api/orders', require('./routes/orderRoutes.js'));
app.use('/api/customers', require('./routes/customerRoutes.js'));
app.use('/api/payments', require('./routes/paymentRoutes.js'));
app.use('/api/dashboard-stats', require('./routes/dashboardRoutes.js'));
app.use('/api/reports', require('./routes/reportRoutes.js'));
app.use('/api/activity-log', require('./routes/activityLogRoutes.js'));


app.get('/', (req, res) => res.send('EasyOrganic Backend API is running.'));

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});