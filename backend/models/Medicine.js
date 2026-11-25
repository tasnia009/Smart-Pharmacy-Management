import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    manufacturer: {
      type: String,
      default: '',
    },

    batchNumber: {
      type: String,
      default: '',
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    supplier: {
      type: String,
      default: '',
    },

    lowStockLimit: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;