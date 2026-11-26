import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true
        },

        customerName: {
            type: String,
            default: 'Walk-in Customer'
        },

        customerPhone: {
            type: String,
            default: ''
        },

        items: [
            {
                medicine: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Medicine',
                    required: true
                },

                medicineName: {
                    type: String,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                price: {
                    type: Number,
                    required: true
                },

                subtotal: {
                    type: Number,
                    required: true
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ['Cash', 'Card', 'Mobile Banking'],
            default: 'Cash'
        }
    },
    {
        timestamps: true
    }
);

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;