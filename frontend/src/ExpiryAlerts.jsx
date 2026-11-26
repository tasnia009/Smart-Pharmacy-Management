import { useEffect, useState } from 'react';

function ExpiryAlerts() {
  const [expiredMedicines, setExpiredMedicines] = useState([]);
  const [expiringSoonMedicines, setExpiringSoonMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchExpiryAlerts = async () => {
    try {
      setError('');
      setRefreshing(true);

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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExpiryAlerts();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return 'Invalid date';

    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const MedicineTable = ({ medicines, emptyMessage, type }) => {
    if (medicines.length === 0) {
      return (
        <div className="py-12 text-center">
          <div className="text-4xl mb-3">
            {type === 'expired' ? '✅' : '📅'}
          </div>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm">
              <th className="px-5 py-4 font-semibold">Medicine Name</th>
              <th className="px-5 py-4 font-semibold">Category</th>
              <th className="px-5 py-4 font-semibold">Stock</th>
              <th className="px-5 py-4 font-semibold">Expiry Date</th>
              <th className="px-5 py-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((medicine) => (
              <tr
                key={medicine._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-gray-800">
                    {medicine.name}
                  </p>
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {medicine.category || 'N/A'}
                </td>

                <td className="px-5 py-4 text-gray-700">
                  {medicine.stock}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {formatDate(medicine.expiryDate)}
                </td>

                <td className="px-5 py-4">
                  {type === 'expired' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      Expired
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                      Expiring Soon
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 font-medium">
          Loading expiry alerts...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm text-center">
          <p className="text-red-600 font-semibold mb-4">
            Unable to load expiry alerts: {error}
          </p>

          <button
            onClick={fetchExpiryAlerts}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Expiry Alert System
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor expired and upcoming medicine expiry dates.
          </p>
        </div>

        <button
          onClick={fetchExpiryAlerts}
          disabled={refreshing}
          className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {refreshing ? 'Refreshing...' : '↻ Refresh Alerts'}
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Expired Card */}
        <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">
                Expired Medicines
              </p>

              <h2 className="text-4xl font-bold text-red-600 mt-3">
                {expiredMedicines.length}
              </h2>

              <p className="text-sm text-red-500 mt-2">
                Medicines past their expiry date
              </p>
            </div>

            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
              ⚠️
            </div>
          </div>

        </div>

        {/* Expiring Soon Card */}
        <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">
                Expiring Soon
              </p>

              <h2 className="text-4xl font-bold text-orange-500 mt-3">
                {expiringSoonMedicines.length}
              </h2>

              <p className="text-sm text-orange-500 mt-2">
                Expiring within the next 30 days
              </p>
            </div>

            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
              📅
            </div>
          </div>

        </div>

      </div>

      {/* Expired Medicines Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">

        <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Expired Medicines
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Medicines that should no longer be sold.
            </p>
          </div>

          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
            {expiredMedicines.length} Items
          </span>
        </div>

        <MedicineTable
          medicines={expiredMedicines}
          emptyMessage="Great! No expired medicines found."
          type="expired"
        />

      </div>

      {/* Expiring Soon Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">

        <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Expiring Soon Medicines
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Medicines approaching their expiry date.
            </p>
          </div>

          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
            {expiringSoonMedicines.length} Items
          </span>
        </div>

        <MedicineTable
          medicines={expiringSoonMedicines}
          emptyMessage="No medicines expiring within 30 days."
          type="soon"
        />

      </div>

    </div>
  );
}

export default ExpiryAlerts;