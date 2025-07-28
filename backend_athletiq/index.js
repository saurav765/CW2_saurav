const express = require("express");
const { sequelize, connectDB } = require('./db/database');
const { User, Trainer } = require('./db/models');
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // Load .env variables

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/user', require('./route/userroute'));
app.use('/api/memberships', require('./route/membershiproute'));
app.use("/api/attendance", require("./route/attendanceroute"));
app.use('/api/trainers', require('./route/trainerroute'));
app.use('/api/admin', require('./route/adminroute'));

app.get('/', (req, res) => {
    res.send('Hello, Welcome to AthletiQ.');
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync(); // Sync models with DB
        app.listen(PORT, () => {
            console.log(`✅ Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
    }
};

startServer();
