// routes/planRoutes.js
const express = require('express');
const router = express.Router();
const {
    addPlan,
    getPlans,
    getPlanById,
    updatePlan,
    deletePlan
} = require('../controllers/planController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addPlan);
router.get('/', authMiddleware, getPlans);
router.get('/:id', authMiddleware, getPlanById);
router.put('/:id', authMiddleware, updatePlan);
router.delete('/:id', authMiddleware, deletePlan);

module.exports = router;