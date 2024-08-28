const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const serviceRequestRoutes = require('./routes/serviceRequests');
const engineerRoutes = require('./routes/engineers');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/repairServiceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/service-requests', serviceRequestRoutes);
app.use('/engineers', engineerRoutes);

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});

const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));