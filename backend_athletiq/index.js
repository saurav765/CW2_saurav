const express = require("express");
const { sequelize, connectDB } = require('./db/database');
const PORT = process.env.PORT;
const app = express();
require("dotenv").config();
app.use(express.json());

app.use('/api/user',require('./route/userroute'));

app.get('/', (req, res) => {
res.send('Hello, Welcome to AthletiQ.');
});
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
const startServer = async () => {
    await connectDB();
    await sequelize.sync();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
startServer();