// controllers/patientController.js
const Patient = require('../models/Patient');

// Add new patient
exports.addPatient = async (req, res) => {
    const { name, age, planId } = req.body;
    const patient = new Patient({ name, age, planId });

    try {
        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ error: 'Could not add patient' });
    }
};

// Get all patients
exports.getPatients = async (req, res) => {
    const patients = await Patient.find().populate('planId');
    res.json(patients);
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
    const patient = await Patient.findById(req.params.id).populate('planId');
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
};

// Update patient
exports.updatePatient = async (req, res) => {
    const { name, age, planId } = req.body;
    const patient = await Patient.findByIdAndUpdate(req.params.id, { name, age, planId }, { new: true });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
};

// Delete patient
exports.deletePatient = async (req, res) => {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
};