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

  // Fetch medicines
  const fetchMedicines = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load medicines');
      }

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

  // Handle input changes
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Something went wrong!');
      }

      alert(
        editingId
          ? 'Medicine updated successfully!'
          : 'Medicine added successfully!'
      );

      resetForm();
      fetchMedicines();

    } catch (error) {
      console.error(error);
      alert(error.message || 'Backend connection failed!');
    }
  };

  // Edit medicine
  const handleEdit = (medicine) => {
    setEditingId(medicine._id);

    setForm({
      name: medicine.name || '',
      category: medicine.category || '',
      manufacturer: medicine.manufacturer || '',
      batchNumber: medicine.batchNumber || '',
      price: medicine.price ?? '',
      stock: medicine.stock ?? '',
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Delete failed!');
      }

      alert('Medicine deleted successfully!');
      fetchMedicines();

    } catch (error) {
      alert(error.message || 'Delete failed!');
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

  // Search
  const filteredMedicines = medicines.filter((medicine) =>
    [medicine.name, medicine.category, medicine.manufacturer]
      .some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(search.toLowerCase())
      )
  );

  // Statistics
  const lowStockCount = medicines.filter(
    (medicine) =>
      Number(medicine.stock) > 0 &&
      Number(medicine.stock) <= Number(medicine.lowStockLimit ?? 10)
  ).length;

  const outOfStockCount = medicines.filter(
    (medicine) => Number(medicine.stock) === 0
  ).length;

  const totalStock = medicines.reduce(
    (total, medicine) => total + Number(medicine.stock || 0),
    0
  );

  // Stock status
  const getStockStatus = (medicine) => {
    const stock = Number(medicine.stock);
    const limit = Number(medicine.lowStockLimit ?? 10);

    if (stock === 0) {
      return {
        label: 'Out of Stock',
        style: 'bg-red-100 text-red-700',
      };
    }

    if (stock <= limit) {
      return {
        label: 'Low Stock',
        style: 'bg-orange-100 text-orange-700',
      };
    }

    return {
      label: 'Available',
      style: 'bg-emerald-100 text-emerald-700',
    };
  };

  const inputStyle =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100';

  const labelStyle =
    'mb-2 block text-sm font-semibold text-gray-700';

  return (
    <div className="space-y-7">

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-sm font-semibold text-emerald-600">
            PHARMACY MANAGEMENT
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-800">
            Medicine Inventory
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage medicines, stock levels and medicine information.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            document.getElementById('medicine-form')?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
          className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-800"
        >
          + Add New Medicine
        </button>

      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Medicines</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-800">
                {medicines.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
              💊
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <h2 className="mt-3 text-3xl font-bold text-orange-500">
                {lowStockCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              ⚠️
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <h2 className="mt-3 text-3xl font-bold text-red-500">
                {outOfStockCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
              📉
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stock Units</p>
              <h2 className="mt-3 text-3xl font-bold text-blue-600">
                {totalStock}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              📦
            </div>
          </div>
        </div>

      </div>

      {/* ADD / UPDATE FORM */}
      <div
        id="medicine-form"
        className="scroll-mt-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
      >

        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
            {editingId ? '✏️' : '➕'}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Update Medicine' : 'Add New Medicine'}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the medicine details below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            <div>
              <label className={labelStyle}>Medicine Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Napa"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Category *</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Tablet"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                placeholder="Company name"
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Batch Number</label>
              <input
                type="text"
                name="batchNumber"
                value={form.batchNumber}
                onChange={handleChange}
                placeholder="Enter batch number"
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Price (৳) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Supplier</label>
              <input
                type="text"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="Supplier name"
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Low Stock Limit</label>
              <input
                type="number"
                name="lowStockLimit"
                value={form.lowStockLimit}
                onChange={handleChange}
                min="0"
                className={inputStyle}
              />
            </div>

          </div>

          <div className="mt-7 flex flex-wrap gap-3">

            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-7 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-800"
            >
              {editingId ? '✓ Update Medicine' : '+ Save Medicine'}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-gray-200 bg-gray-100 px-7 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              {editingId ? 'Cancel' : 'Clear Form'}
            </button>

          </div>

        </form>
      </div>

      {/* MEDICINE INVENTORY TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Medicine Inventory
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage all available medicines.
            </p>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 md:w-72"
            />
          </div>

        </div>

        {loading ? (

          <div className="p-12 text-center text-gray-500">
            Loading medicines...
          </div>

        ) : filteredMedicines.length === 0 ? (

          <div className="p-12 text-center">
            <div className="text-5xl">💊</div>

            <h3 className="mt-4 font-bold text-gray-700">
              No Medicines Found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add a medicine or try another search.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-emerald-50 text-xs uppercase tracking-wider text-emerald-900">
                <tr>
                  <th className="px-5 py-4">Medicine</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Expiry Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredMedicines.map((medicine) => {

                  const status = getStockStatus(medicine);

                  return (
                    <tr
                      key={medicine._id}
                      className="transition hover:bg-emerald-50/40"
                    >

                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {medicine.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {medicine.manufacturer || 'No manufacturer'}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {medicine.category}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                        ৳{medicine.price}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                        {medicine.stock}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {medicine.expiryDate
                          ? new Date(medicine.expiryDate).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.style}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">

                          <button
                            onClick={() => handleEdit(medicine)}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(medicine._id)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

        <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
          Showing {filteredMedicines.length} of {medicines.length} medicines
        </div>

      </div>

    </div>
  );
}

export default Medicine;