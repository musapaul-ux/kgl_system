const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    saleType: {
        type: String,
        enum: ['Cash', 'Credit'],
        required: true
    },

    produceName: String,
    produceType: String,
    tonnage: Number,

    amountPaid: Number,        // cash
    amountDue: Number,         // credit

    buyerName: String,
    nationalId: String,
    location: String,
    contacts: String,

    salesAgentName: String,
    date: String,
    time: String,
    dueDate: String,
    dispatchDate: String
});

module.exports = mongoose.model('Sale', saleSchema);
