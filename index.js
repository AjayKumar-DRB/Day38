// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Local data storage (for demonstration purposes)
let rooms = [];
let bookings = [];

// API Endpoints

// Create a Room
app.post('/api/rooms', (req, res) => {
    const { roomName, seatsAvailable, amenities, pricePerHour } = req.body;

    // Check if roomName already exists
    const existingRoom = rooms.find(room => room.roomName === roomName);
    if (existingRoom) {
        return res.status(400).json({ message: 'Room name already exists' });
    }

    const newRoom = { roomId: rooms.length + 1, roomName, seatsAvailable, amenities, pricePerHour };
    rooms.push(newRoom);
    res.json(newRoom);
});

// Book a Room
app.post('/api/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const room = rooms.find(room => room.roomId === roomId);
    if (!room) {
        return res.status(404).json({ message: 'Room not found' });
    }
    const newBooking = { 
        bookingId: bookings.length + 1, 
        customerName, 
        date, 
        startTime, 
        endTime, 
        roomId, 
        roomName: room.roomName ,
        bookingDate: new Date().toISOString().split('T')[0],
        bookingTime: new Date().toISOString().split('T')[1].split('.')[0],
        bookingStatus: "Booked",
    };
    bookings.push(newBooking);
    res.json(newBooking);
});

// List all Rooms with Booked Data
app.get('/api/rooms/bookings', (req, res) => {
    const roomsWithBookings = rooms.map(room => {
        const bookedData = bookings.filter(booking => booking.roomId === room.roomId);
        return {
            roomName: room.roomName,
            bookedData
        };
    });
    res.json(roomsWithBookings);
});

// List all customers with booked Data
app.get('/api/customers/bookings', (req, res) => {
    const customersWithBookings = bookings.map(booking => {
        const { customerName, date, startTime, endTime, roomName } = booking;
        return { customerName, date, startTime, endTime, roomName };
    });
    res.json(customersWithBookings);
});

// List how many times a customer has booked the room
app.get('/api/customers/:customerName/bookings', (req, res) => {
    const { customerName } = req.params;
    const customerBookings = bookings.filter(booking => booking.customerName === customerName);
    res.json(customerBookings);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
