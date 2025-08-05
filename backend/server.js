// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data - replace with database later
let lockers = [
  { id: 1, number: '101', status: 'available', location: 'Floor 1', type: 'small' },
  { id: 2, number: '102', status: 'occupied', location: 'Floor 1', type: 'medium' },
  { id: 3, number: '103', status: 'maintenance', location: 'Floor 1', type: 'large' },
  { id: 4, number: '201', status: 'available', location: 'Floor 2', type: 'small' },
  { id: 5, number: '202', status: 'occupied', location: 'Floor 2', type: 'medium' },
];

// Routes
// Get all lockers
app.get('/api/lockers', (req, res) => {
  res.json(lockers);
});

// Get dashboard stats
app.get('/api/lockers/stats/dashboard', (req, res) => {
  const total = lockers.length;
  const available = lockers.filter(l => l.status === 'available').length;
  const occupied = lockers.filter(l => l.status === 'occupied').length;
  const maintenance = lockers.filter(l => l.status === 'maintenance').length;

  res.json({
    total,
    available,
    occupied,
    maintenance,
    occupancyRate: ((occupied / total) * 100).toFixed(1)
  });
});

// Get single locker
app.get('/api/lockers/:id', (req, res) => {
  const locker = lockers.find(l => l.id === parseInt(req.params.id));
  if (!locker) {
    return res.status(404).json({ error: 'Locker not found' });
  }
  res.json(locker);
});

// Create new locker
app.post('/api/lockers', (req, res) => {
  const { number, location, type } = req.body;
  const newLocker = {
    id: lockers.length + 1,
    number,
    location,
    type,
    status: 'available'
  };
  lockers.push(newLocker);
  res.status(201).json(newLocker);
});

// Update locker
app.put('/api/lockers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const lockerIndex = lockers.findIndex(l => l.id === id);
  
  if (lockerIndex === -1) {
    return res.status(404).json({ error: 'Locker not found' });
  }
  
  lockers[lockerIndex] = { ...lockers[lockerIndex], ...req.body };
  res.json(lockers[lockerIndex]);
});

// Delete locker
app.delete('/api/lockers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const lockerIndex = lockers.findIndex(l => l.id === id);
  
  if (lockerIndex === -1) {
    return res.status(404).json({ error: 'Locker not found' });
  }
  
  lockers.splice(lockerIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
