// routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const {
    addPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addPatient);
router.get('/', authMiddleware, getPatients);
router.get('/:id', authMiddleware, getPatientById);
router.put('/:id', authMiddleware, updatePatient);
router.delete('/:id', authMiddleware, deletePatient);

module.exports = router;