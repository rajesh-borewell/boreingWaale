const express = require("express");
const router = express.Router();
const Estimate = require("../models/Estimate");
const auth = require("../middleware/auth");

// Get stats for dashboard (protected)
router.get("/stats", auth, async (req, res) => {
    try {
        const totalCount = await Estimate.countDocuments();
        res.json({ totalCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new estimate (protected)
router.post("/", auth, async (req, res) => {
    try {
        const newEstimate = new Estimate({ ...req.body, createdBy: req.user });
        const savedEstimate = await newEstimate.save();
        res.status(201).json(savedEstimate);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Search history (protected)
router.get("/", auth, async (req, res) => {
    try {
        const { estimateNumber, clientName, startDate, endDate } = req.query;
        let query = {};

        if (estimateNumber) {
            query.estimateNumber = Number(estimateNumber);
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

        const estimates = await Estimate.find(query).populate('createdBy', 'username').sort({ estimateNumber: 1 });
        res.json(estimates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single estimate details (protected)
router.get("/:id", auth, async (req, res) => {
    try {
        const estimate = await Estimate.findById(req.params.id).populate('createdBy', 'username');
        if (!estimate) return res.status(404).json({ error: "Estimate not found" });
        res.json(estimate);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an estimate (protected)
router.put("/:id", auth, async (req, res) => {
    try {
        const { clientName, date, items, grandTotal } = req.body;
        const estimate = await Estimate.findById(req.params.id);

        if (!estimate) return res.status(404).json({ error: "Estimate not found" });

        // Update fields
        if (clientName) estimate.clientName = clientName;
        if (date) estimate.date = date;
        if (items) estimate.items = items;
        if (grandTotal !== undefined) estimate.grandTotal = grandTotal;

        const updatedEstimate = await estimate.save();
        const populatedEstimate = await Estimate.findById(updatedEstimate._id).populate('createdBy', 'username');
        res.json(populatedEstimate);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
