import { useState, useEffect } from 'react';
import Invoice from './Invoice';

const API_URL = 'http://localhost:5000/api';

function Sales() {
    const [medicines, setMedicines] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [completedSale, setCompletedSale] = useState(null);

    // Fetch medicines
    const fetchMedicines = async () => {
        try {
            const response = await fetch(`${API_URL}/medicines`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to load medicines.');
            }

            setMedicines(data.medicines || []);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    // Add medicine to cart
    const addToCart = (medicine) => {
        setError('');
        setMessage('');

        if (medicine.stock <= 0) {
            setError('This medicine is out of stock.');
            return;
        }

        const existingItem = cart.find(
            (item) => item._id === medicine._id
        );

        if (existingItem) {
            if (existingItem.quantity >= medicine.stock) {
                setError('Not enough stock available.');
                return;
            }

            setCart(cart.map((item) =>
                item._id === medicine._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...medicine, quantity: 1 }]);
        }
    };

    // Update quantity
    const updateQuantity = (id, quantity) => {
        const medicine = medicines.find((item) => item._id === id);
        const newQuantity = Number(quantity);

        if (!medicine || newQuantity < 1 || !Number.isInteger(newQuantity)) {
            return;
        }

        if (newQuantity > medicine.stock) {
            setError('Not enough stock available.');
            return;
        }

        setError('');

        setCart(cart.map((item) =>
            item._id === id
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    // Remove medicine
    const removeItem = (id) => {
        setCart(cart.filter((item) => item._id !== id));
    };

    // Calculate total
    const totalAmount = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // Complete sale
    const handleCheckout = async () => {
        if (cart.length === 0) {
            setError('Please add medicines to the cart.');
            return;
        }

        setError('');
        setMessage('');
        setProcessing(true);

        try {
            const response = await fetch(`${API_URL}/sales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customerName,
                    customerPhone,
                    paymentMethod,
                    items: cart.map((item) => ({
                        medicineId: item._id,
                        quantity: item.quantity
                    }))
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Sale failed.');
            }

            // Save completed sale for invoice display
            setCompletedSale(data.sale);

            setMessage(
                `Sale successful! Invoice: ${data.sale.invoiceNumber}`
            );

            setCart([]);
            setCustomerName('');
            setCustomerPhone('');

            fetchMedicines();

        } catch (err) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    const filteredMedicines = medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Sales & Billing
                </h1>

                <p className="mt-2 text-gray-500">
                    Create invoices and manage pharmacy sales.
                </p>
            </div>

            {/* Messages */}
            {message && (
                <div className="mb-5 rounded-xl bg-green-100 p-4 text-green-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-5 rounded-xl bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* Medicine Selection */}
                <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">

                    <h2 className="mb-5 text-xl font-bold text-gray-800">
                        Select Medicines
                    </h2>

                    <input
                        type="text"
                        placeholder="Search medicine by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-5 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />

                    {loading ? (
                        <p className="py-8 text-center text-gray-500">
                            Loading medicines...
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {filteredMedicines.map((medicine) => (
                                <div
                                    key={medicine._id}
                                    className="rounded-xl border border-gray-100 p-4 transition hover:border-green-300 hover:shadow-md"
                                >
                                    <h3 className="font-semibold text-gray-800">
                                        {medicine.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {medicine.category}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">

                                        <div>
                                            <p className="font-bold text-green-700">
                                                ৳{medicine.price}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Stock: {medicine.stock}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => addToCart(medicine)}
                                            disabled={medicine.stock <= 0}
                                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                                        >
                                            Add +
                                        </button>

                                    </div>
                                </div>
                            ))}

                            {filteredMedicines.length === 0 && (
                                <p className="col-span-full py-8 text-center text-gray-400">
                                    No medicines found.
                                </p>
                            )}

                        </div>
                    )}

                </div>

                {/* Billing Cart */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-xl font-bold text-gray-800">
                        Current Bill
                    </h2>

                    {/* Customer Information */}
                    <div className="space-y-3">

                        <input
                            type="text"
                            placeholder="Customer name (optional)"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="text"
                            placeholder="Customer phone (optional)"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
                        />

                    </div>

                    {/* Cart Items */}
                    <div className="my-6 space-y-4">

                        {cart.length === 0 ? (
                            <p className="py-8 text-center text-gray-400">
                                Your cart is empty.
                            </p>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item._id}
                                    className="border-b border-gray-100 pb-4"
                                >

                                    <div className="flex justify-between">
                                        <p className="font-semibold text-gray-800">
                                            {item.name}
                                        </p>

                                        <button
                                            onClick={() => removeItem(item._id)}
                                            className="text-sm text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">

                                        <input
                                            type="number"
                                            min="1"
                                            max={item.stock}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateQuantity(item._id, e.target.value)
                                            }
                                            className="w-20 rounded-lg border border-gray-200 p-2"
                                        />

                                        <p className="font-semibold text-green-700">
                                            ৳{(item.price * item.quantity).toFixed(2)}
                                        </p>

                                    </div>

                                </div>
                            ))
                        )}

                    </div>

                    {/* Payment Method */}
                    <label className="mb-2 block font-medium text-gray-700">
                        Payment Method
                    </label>

                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mb-5 w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-500"
                    >
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="Mobile Banking">Mobile Banking</option>
                    </select>

                    {/* Total */}
                    <div className="border-t border-gray-200 pt-5">

                        <div className="flex justify-between text-xl font-bold">
                            <span>Total Amount</span>

                            <span className="text-green-700">
                                ৳{totalAmount.toFixed(2)}
                            </span>
                        </div>

                    </div>

                    {/* Checkout */}
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || processing}
                        className="mt-6 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {processing ? 'Processing...' : 'Complete Sale'}
                    </button>

                </div>

            </div>

            {/* Invoice Popup */}
            {completedSale && (
                <Invoice
                    sale={completedSale}
                    onClose={() => setCompletedSale(null)}
                />
            )}

        </div>
    );
}

export default Sales;