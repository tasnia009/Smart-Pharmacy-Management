import express from 'express';

import {
    getMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    getLowStockMedicines,
    getExpiryAlerts
} from '../controllers/medicineController.js';

const router = express.Router();

// Get all medicines
router.get('/', getMedicines);

// Get low stock medicines
router.get('/low-stock', getLowStockMedicines);

// Get expired and expiring soon medicines
router.get('/expiry-alerts', getExpiryAlerts);

// Add medicine
router.post('/', addMedicine);

// Update medicine
router.put('/:id', updateMedicine);

// Delete medicine
router.delete('/:id', deleteMedicine);

export default router;