const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ItemSchema = new mongoose.Schema({
    srNo: { type: Number, required: true },
    particulars: { type: String, required: true },
    qty: { type: Number, required: true, default: 1 },
    rate: { type: Number, required: true, default: 0 },
    amount: { type: Number, required: true, default: 0 }
}, { _id: false });

const EstimateSchema = new mongoose.Schema({
    estimateNumber: { type: Number, unique: true },
    clientName: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    items: [ItemSchema],
    grandTotal: { type: Number, required: true, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

EstimateSchema.plugin(AutoIncrement, { inc_field: 'estimateNumber', start_seq: 1 });

module.exports = mongoose.model("Estimate", EstimateSchema);
