import Sale from '../models/Sale.js';
import Medicine from '../models/Medicine.js';
import mongoose from 'mongoose';

// ========================================
// CREATE A NEW SALE
// ========================================
export const createSale = async (req, res) => {
    const updatedStock = [];

    try {
        const {
            customerName,
            customerPhone,
            items,
            paymentMethod
        } = req.body;

        // Check whether medicines are added
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please add at least one medicine.'
            });
        }

        let totalAmount = 0;
        const saleItems = [];

        // Process each medicine
        for (const item of items) {
            const medicineId = item.medicineId;
            const quantity = Number(item.quantity);

            if (
                !mongoose.Types.ObjectId.isValid(medicineId) ||
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {
                throw new Error('Invalid medicine ID or quantity.');
            }

            // Find medicine
            const medicine = await Medicine.findById(medicineId);

            if (!medicine) {
                throw new Error('Medicine not found.');
            }

            // Reduce stock only if enough stock is available
            const updatedMedicine = await Medicine.findOneAndUpdate(
                {
                    _id: medicineId,
                    stock: { $gte: quantity }
                },
                {
                    $inc: { stock: -quantity }
                },
                {
                    new: true
                }
            );

            if (!updatedMedicine) {
                throw new Error(
                    `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`
                );
            }

            // Keep track of stock changes for rollback if needed
            updatedStock.push({
                medicineId: medicine._id,
                quantity: quantity
            });

            const subtotal = medicine.price * quantity;

            totalAmount += subtotal;

            saleItems.push({
                medicine: medicine._id,
                medicineName: medicine.name,
                quantity: quantity,
                price: medicine.price,
                subtotal: subtotal
            });
        }

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(
            Math.random() * 1000
        )}`;

        // Save sale
        const sale = await Sale.create({
            invoiceNumber,
            customerName: customerName || 'Walk-in Customer',
            customerPhone: customerPhone || '',
            items: saleItems,
            totalAmount,
            paymentMethod: paymentMethod || 'Cash'
        });

        return res.status(201).json({
            success: true,
            message: 'Sale completed successfully!',
            sale
        });

    } catch (error) {

        // Restore stock if the sale fails
        for (const item of updatedStock) {
            try {
                await Medicine.findByIdAndUpdate(
                    item.medicineId,
                    {
                        $inc: { stock: item.quantity }
                    }
                );
            } catch (rollbackError) {
                console.error('Stock rollback failed:', rollbackError.message);
            }
        }

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// GET ALL SALES
// ========================================
export const getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('items.medicine', 'name category')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            sales
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// GET SINGLE SALE
// ========================================
export const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('items.medicine', 'name category');

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found.'
            });
        }

        return res.status(200).json({
            success: true,
            sale
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};