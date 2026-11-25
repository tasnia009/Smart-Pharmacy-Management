import { useEffect, useState } from 'react';

function ExpiryAlerts() {
  const [expiredMedicines, setExpiredMedicines] = useState([]);
  const [expiringSoonMedicines, setExpiringSoonMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpiryAlerts = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/medicines/expiry-alerts'
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load expiry alerts');
      }

      setExpiredMedicines(data.expiredMedicines || []);
      setExpiringSoonMedicines(data.expiringSoonMedicines || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiryAlerts();
  }, []);

  const MedicineTable = ({ medicines, emptyMessage }) => {
    if (medicines.length === 0) {
      return (
        <p className="text-gray-500 py-4">{emptyMessage}</p>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Expiry Date</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine._id} className="border-b">
                <td className="p-3">{medicine.name}</td>
                <td className="p-3">{medicine.category}</td>
                <td className="p-3">{medicine.stock}</td>
                <td className="p-3">
                  {new Date(medicine.expiryDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return <p className="p-6">Loading expiry alerts...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">Error: {error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Expiry Alert System
      </h1>

      <p className="text-gray-600 mb-6">
        Monitor expired and upcoming medicine expiry dates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

        <div className="bg-red-100 p-6 rounded-xl shadow">
          <h2 className="text-red-700 font-semibold">
            Expired Medicines
          </h2>
          <p className="text-4xl font-bold text-red-700 mt-2">
            {expiredMedicines.length}
          </p>
        </div>

        <div className="bg-orange-100 p-6 rounded-xl shadow">
          <h2 className="text-orange-700 font-semibold">
            Expiring Soon (30 Days)
          </h2>
          <p className="text-4xl font-bold text-orange-700 mt-2">
            {expiringSoonMedicines.length}
          </p>
        </div>

      </div>

      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-xl font-bold text-red-700 mb-4">
          Expired Medicines
        </h2>

        <MedicineTable
          medicines={expiredMedicines}
          emptyMessage="No expired medicines found."
        />
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-bold text-orange-700 mb-4">
          Expiring Soon Medicines
        </h2>

        <MedicineTable
          medicines={expiringSoonMedicines}
          emptyMessage="No medicines expiring within 30 days."
        />
      </div>

      <button
        onClick={fetchExpiryAlerts}
        className="mt-6 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
      >
        Refresh Alerts
      </button>

    </div>
  );
}

export default ExpiryAlerts;