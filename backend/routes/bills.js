const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const auth = require("../middleware/auth");

// Get stats for dashboard (protected)
router.get("/stats", auth, async (req, res) => {
    try {
        const totalCount = await Bill.countDocuments();
        res.json({ totalCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new bill (protected)
router.post("/", auth, async (req, res) => {
    try {
        const newBill = new Bill({ ...req.body, createdBy: req.user });
        const savedBill = await newBill.save();
        res.status(201).json(savedBill);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Search history (protected)
router.get("/", auth, async (req, res) => {
    try {
        const { billNumber, clientName, startDate, endDate } = req.query;
        let query = {};

        if (billNumber) {
            query.billNumber = Number(billNumber);
        }
        if (clientName) {
            query.clientName = { $regex: clientName, $options: "i" };
        }
        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                const sDate = new Date(startDate);
                sDate.setHours(0, 0, 0, 0);
                query.date.$gte = sDate;
            }
            if (endDate) {
                const eDate = new Date(endDate);
                eDate.setHours(23, 59, 59, 999);
                query.date.$lte = eDate;
            }
        }

        const bills = await Bill.find(query).populate('createdBy', 'username').sort({ billNumber: 1 });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single bill details (protected)
router.get("/:id", auth, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id).populate('createdBy', 'username');
        if (!bill) return res.status(404).json({ error: "Bill not found" });
        res.json(bill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a bill (protected)
router.put("/:id", auth, async (req, res) => {
    try {
        const { clientName, date, items, grandTotal } = req.body;
        const bill = await Bill.findById(req.params.id);

        if (!bill) return res.status(404).json({ error: "Bill not found" });

        // Update fields
        if (clientName) bill.clientName = clientName;
        if (date) bill.date = date;
        if (items) bill.items = items;
        if (grandTotal !== undefined) bill.grandTotal = grandTotal;

        const updatedBill = await bill.save();
        const populatedBill = await Bill.findById(updatedBill._id).populate('createdBy', 'username');
        res.json(populatedBill);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
