const mongoose = require('mongoose');
const Bill = require('./models/Bill');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const bill = await Bill.findOne({ paymentStatus: 'Received' });
    if (!bill) {
        console.log("No received bill found");
        process.exit(0);
    }
    console.log("Found bill:", bill._id);
    
    // Simulate the PUT route logic
    bill.paymentStatus = 'Pending';
    bill.paymentDate = undefined;
    bill.paymentMode = undefined;
    bill.chequeNumber = undefined;
    
    try {
        await bill.save();
        console.log("Successfully reverted!");
    } catch (e) {
        console.error("Error saving:", e.message);
    }
    process.exit(0);
});
