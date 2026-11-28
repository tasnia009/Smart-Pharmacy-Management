import { useEffect, useState } from 'react';
import Invoice from './Invoice';

function SalesHistory() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);

    const fetchSales = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/sales');
            const data = await response.json();

            if (response.ok) {
                setSales(data.sales || []);
            } else {
                alert(data.message || 'Failed to load sales history');
            }
        } catch (error) {
            console.error('Error fetching sales:', error);
            alert('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const filteredSales = sales.filter((sale) => {
        const searchText = search.toLowerCase();

        return (
            sale.invoiceNumber?.toLowerCase().includes(searchText) ||
            sale.customerName?.toLowerCase().includes(searchText) ||
            sale.customerPhone?.includes(searchText)
        );
    });

    const totalRevenue = sales.reduce(
        (total, sale) => total + Number(sale.totalAmount || 0),
        0
    );

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    if (selectedSale) {
        return (
            <Invoice
                sale={selectedSale}
                onClose={() => setSelectedSale(null)}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Sales History
                </h1>
                <p className="text-gray-500 mt-1">
                    View all previous sales and invoices.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-500">Total Sales</p>
                    <h2 className="text-3xl font-bold text-green-600 mt-2">
                        {sales.length}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-500">Total Revenue</p>
                    <h2 className="text-3xl font-bold text-green-600 mt-2">
                        ৳{totalRevenue.toFixed(2)}
                    </h2>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Previous Transactions
                    </h2>

                    <input
                        type="text"
                        placeholder="Search invoice or customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-80 outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {loading ? (
                    <p className="text-center py-8 text-gray-500">
                        Loading sales history...
                    </p>
                ) : filteredSales.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">
                        No sales records found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600">
                                    <th className="p-3">Invoice</th>
                                    <th className="p-3">Customer</th>
                                    <th className="p-3">Phone</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Payment</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSales.map((sale) => (
                                    <tr
                                        key={sale._id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-3 font-medium">
                                            {sale.invoiceNumber || 'N/A'}
                                        </td>

                                        <td className="p-3">
                                            {sale.customerName || 'Walk-in Customer'}
                                        </td>

                                        <td className="p-3">
                                            {sale.customerPhone || 'N/A'}
                                        </td>

                                        <td className="p-3">
                                            {formatDate(sale.createdAt)}
                                        </td>

                                        <td className="p-3">
                                            {sale.paymentMethod || 'N/A'}
                                        </td>

                                        <td className="p-3 font-semibold text-green-600">
                                            ৳{Number(sale.totalAmount || 0).toFixed(2)}
                                        </td>

                                        <td className="p-3">
                                            <button
                                                onClick={() => setSelectedSale(sale)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                                            >
                                                View Bill
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SalesHistory;