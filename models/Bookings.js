const mongoose = require('mongoose');
const Company = require('./Company');
const User = require('./User');

const BookingSchema = new mongoose.Schema({
    bookingDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(date) {
                return date >= new Date('2022-05-10') && date <= new Date('2022-05-13');
            },
            message: 'Booking date must be between May 10th and May 13th, 2022.'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bookings', BookingSchema);
