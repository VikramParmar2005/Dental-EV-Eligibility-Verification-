// controllers/planController.js
const Plan = require('../models/Plan');

// Add new plan
exports.addPlan = async (req, res) => {
    const { planId, planName, details } = req.body;
    const plan = new Plan({ planId, planName, details });

    try {
        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ error: 'Could not add plan' });
    }
};

// Get all plans
exports.getPlans = async (req, res) => {
    const plans = await Plan.find();
    res.json(plans);
};

// Get plan by ID
exports.getPlanById = async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
};

// Update plan
exports.updatePlan = async (req, res) => {
    const { planId, planName, details } = req.body;
    const plan = await Plan.findByIdAndUpdate(req.params.id, { planId, planName, details }, { new: true });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
};

// Delete plan
exports.deletePlan = async (req, res) => {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json({ message: 'Plan deleted' });
};