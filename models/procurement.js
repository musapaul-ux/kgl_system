const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
    produceName: { type: String, required: true },
    produceType: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    tonnage: { type: Number, min: 1000, required: true },
    cost: { type: Number, min: 10000, required: true },
    dealerName: { type: String, required: true },
    branch: { type: String, enum: ['Maganjo', 'Matugga'], required: true },
    contact: { type: String, required: true },
    sellingPrice: { type: Number, required: true }
});

module.exports = mongoose.model('Procurement', procurementSchema);
