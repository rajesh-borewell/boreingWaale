const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ItemSchema = new mongoose.Schema({
    srNo: { type: Number, required: true },
    particulars: { type: String, required: true },
    qty: { type: Number, required: true, default: 1 },
    rate: { type: Number, required: true, default: 0 },
    amount: { type: Number, required: true, default: 0 }
}, { _id: false });

const BillSchema = new mongoose.Schema({
    billNumber: { type: Number, unique: true },
    clientName: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    items: [ItemSchema],
    grandTotal: { type: Number, required: true, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

BillSchema.plugin(AutoIncrement, { inc_field: 'billNumber', start_seq: 1 });

module.exports = mongoose.model("Bill", BillSchema);
