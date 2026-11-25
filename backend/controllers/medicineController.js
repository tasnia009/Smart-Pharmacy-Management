import Medicine from '../models/Medicine.js';

// Get All Medicines
export const getMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: medicines.length,
            medicines
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add New Medicine
export const addMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Medicine added successfully',
            medicine
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update Medicine
export const updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: 'Medicine not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Medicine updated successfully',
            medicine
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Medicine
export const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: 'Medicine not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Medicine deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Low Stock Medicines
export const getLowStockMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find({
            $expr: {
                $lte: ['$stock', '$lowStockLimit']
            }
        });

        res.status(200).json({
            success: true,
            count: medicines.length,
            medicines
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Get expired and expiring soon medicines
export const getExpiryAlerts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next30Days = new Date();
    next30Days.setDate(next30Days.getDate() + 30);
    next30Days.setHours(23, 59, 59, 999);

    const medicines = await Medicine.find({
      expiryDate: { $lte: next30Days }
    }).sort({ expiryDate: 1 });

    const expiredMedicines = medicines.filter(
      medicine => new Date(medicine.expiryDate) < today
    );

    const expiringSoonMedicines = medicines.filter(
      medicine =>
        new Date(medicine.expiryDate) >= today &&
        new Date(medicine.expiryDate) <= next30Days
    );

    res.status(200).json({
      success: true,
      expiredCount: expiredMedicines.length,
      expiringSoonCount: expiringSoonMedicines.length,
      expiredMedicines,
      expiringSoonMedicines
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};