function Invoice({ sale, onClose }) {
    if (!sale) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8 print:hidden">
                <h2 className="text-2xl font-bold text-gray-800">
                    Invoice
                </h2>

                <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                >
                    Close
                </button>
            </div>

            <div id="invoice-content">
                <div className="text-center border-b pb-6 mb-6">
                    <h1 className="text-3xl font-bold text-green-700">
                        Smart Pharmacy
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Medicine Management System
                    </p>
                    <h2 className="text-xl font-semibold mt-4">
                        SALES INVOICE
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <p className="text-gray-500 text-sm">Invoice Number</p>
                        <p className="font-semibold">
                            {sale.invoiceNumber || 'N/A'}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Date</p>
                        <p className="font-semibold">
                            {new Date(sale.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Customer Name</p>
                        <p className="font-semibold">
                            {sale.customerName || 'Walk-in Customer'}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Customer Phone</p>
                        <p className="font-semibold">
                            {sale.customerPhone || 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse mb-6">
                        <thead>
                            <tr className="bg-green-100">
                                <th className="border p-3 text-left">Medicine</th>
                                <th className="border p-3">Quantity</th>
                                <th className="border p-3">Price</th>
                                <th className="border p-3">Subtotal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sale.items?.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-3">
                                        {item.medicineName || item.name || item.medicine?.name || 'Medicine'}
                                    </td>

                                    <td className="border p-3 text-center">
                                        {item.quantity}
                                    </td>

                                    <td className="border p-3 text-center">
                                        ৳{Number(item.price || 0).toFixed(2)}
                                    </td>

                                    <td className="border p-3 text-center">
                                        ৳{(
                                            Number(item.price || 0) *
                                            Number(item.quantity || 0)
                                        ).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <div className="w-full md:w-64 space-y-3">
                        <div className="flex justify-between font-bold text-xl border-t pt-3">
                            <span>Total:</span>
                            <span className="text-green-700">
                                ৳{Number(sale.totalAmount || 0).toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="font-semibold">
                                {sale.paymentMethod || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-center border-t mt-10 pt-6">
                    <p className="font-semibold text-green-700">
                        Thank you for shopping with us!
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Get well soon.
                    </p>
                </div>
            </div>

            <div className="flex justify-center mt-8 print:hidden">
                <button
                    onClick={handlePrint}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                    🖨️ Print Bill
                </button>
            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }

                    #invoice-content,
                    #invoice-content * {
                        visibility: visible;
                    }

                    #invoice-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
}

export default Invoice;