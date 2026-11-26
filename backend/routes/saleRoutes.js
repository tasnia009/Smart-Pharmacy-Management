import express from 'express';

import {
    createSale,
    getSales,
    getSaleById
} from '../controllers/saleController.js';

const router = express.Router();

// Create a new sale
router.post('/', createSale);

// Get all sales
router.get('/', getSales);

// Get a single sale
router.get('/:id', getSaleById);

export default router;