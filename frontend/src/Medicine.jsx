import { useEffect, useState } from 'react';

const API = 'http://localhost:5000/api/medicines';

function Medicine() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: '',
    manufacturer: '',
    batchNumber: '',
    price: '',
    stock: '',
    expiryDate: '',
    supplier: '',
    lowStockLimit: 10,
  });

  // Fetch medicines from backend
  const fetchMedicines = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();

      if (data.success) {
        setMedicines(data.medicines);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      alert('Cannot connect to backend!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add or update medicine
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `${API}/${editingId}`
        : API;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          editingId
            ? 'Medicine updated successfully!'
            : 'Medicine added successfully!'
        );

        resetForm();
        fetchMedicines();
      } else {
        alert(data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      alert('Backend connection failed!');
    }
  };

  // Edit medicine
  const handleEdit = (medicine) => {
    setEditingId(medicine._id);

    setForm({
      name: medicine.name,
      category: medicine.category,
      manufacturer: medicine.manufacturer || '',
      batchNumber: medicine.batchNumber || '',
      price: medicine.price,
      stock: medicine.stock,
      expiryDate: medicine.expiryDate
        ? medicine.expiryDate.substring(0, 10)
        : '',
      supplier: medicine.supplier || '',
      lowStockLimit: medicine.lowStockLimit ?? 10,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Delete medicine
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this medicine?'
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Medicine deleted successfully!');
        fetchMedicines();
      }
    } catch (error) {
      alert('Delete failed!');
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: '',
      category: '',
      manufacturer: '',
      batchNumber: '',
      price: '',
      stock: '',
      expiryDate: '',
      supplier: '',
      lowStockLimit: 10,
    });
  };

  // Search medicine
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(search.toLowerCase()) ||
    medicine.category.toLowerCase().includes(search.toLowerCase())
  );

  // Low stock count
  const lowStockCount = medicines.filter(
    (medicine) => medicine.stock <= medicine.lowStockLimit
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          Medicine Management
        </h1>

        <p className="mt-2 text-gray-600">
          Manage medicines, inventory and stock levels.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl bg-white p-5 shadow">
          <h3 className="text-gray-500">Total Medicines</h3>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {medicines.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <h3 className="text-gray-500">Low Stock Medicines</h3>
          <p className="mt-2 text-3xl font-bold text-orange-500">
            {lowStockCount}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <h3 className="text-gray-500">Total Stock Units</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {medicines.reduce(
              (total, medicine) => total + Number(medicine.stock),
              0
            )}
          </p>
        </div>

      </div>

      {/* Add Medicine Form */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-5 text-xl font-bold text-gray-800">
          {editingId ? 'Update Medicine' : 'Add New Medicine'}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Medicine Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Napa"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Category *
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Tablet"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Manufacturer
              </label>

              <input
                type="text"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                placeholder="Company name"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Batch Number
              </label>

              <input
                type="text"
                name="batchNumber"
                value={form.batchNumber}
                onChange={handleChange}
                placeholder="Batch number"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Price (৳) *
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                min="0"
                step="0.01"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Stock Quantity *
              </label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Quantity"
                min="0"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Expiry Date *
              </label>

              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Supplier
              </label>

              <input
                type="text"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="Supplier name"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Low Stock Limit
              </label>

              <input
                type="number"
                name="lowStockLimit"
                value={form.lowStockLimit}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border p-3"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-5 flex gap-3">

            <button
              type="submit"
              className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
            >
              {editingId ? 'Update Medicine' : 'Add Medicine'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* Medicine List */}
      <div className="rounded-xl bg-white p-6 shadow">

        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row">

          <h2 className="text-xl font-bold text-gray-800">
            Medicine Inventory
          </h2>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine..."
            className="rounded-lg border p-3 md:w-64"
          />

        </div>

        {loading ? (
          <p className="py-5 text-center">Loading medicines...</p>
        ) : filteredMedicines.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No medicines found. Add your first medicine above.
          </p>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full border-collapse text-left">

              <thead>
                <tr className="bg-green-100">
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Category</th>
                  <th className="border p-3">Price</th>
                  <th className="border p-3">Stock</th>
                  <th className="border p-3">Expiry</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredMedicines.map((medicine) => (

                  <tr key={medicine._id} className="hover:bg-gray-50">

                    <td className="border p-3 font-medium">
                      {medicine.name}
                    </td>

                    <td className="border p-3">
                      {medicine.category}
                    </td>

                    <td className="border p-3">
                      ৳{medicine.price}
                    </td>

                    <td className="border p-3">
                      {medicine.stock}
                    </td>

                    <td className="border p-3">
                      {new Date(medicine.expiryDate).toLocaleDateString()}
                    </td>

                    <td className="border p-3">

                      {medicine.stock <= medicine.lowStockLimit ? (
                        <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">
                          Low Stock
                        </span>
                      ) : (
                        <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                          Available
                        </span>
                      )}

                    </td>

                    <td className="border p-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() => handleEdit(medicine)}
                          className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(medicine._id)}
                          className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </div>

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

export default Medicine;