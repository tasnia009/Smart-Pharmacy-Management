import { useState } from 'react';
import Medicine from './Medicine';
import ExpiryAlerts from './ExpiryAlerts';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Page Navigation
  const [activePage, setActivePage] = useState('dashboard');

  // Login Function
  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      setActivePage('dashboard');

    } catch (error) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setEmail('');
    setPassword('');
    setActivePage('dashboard');
  };

  // Dashboard after successful login
  if (user) {
    return (
      <div className="min-h-screen bg-gray-100">

        {/* Navbar */}
        <nav className="bg-green-900 text-white p-5 flex flex-wrap justify-between items-center gap-4">

          <h1 className="text-2xl font-bold">
            💊 Smart Pharmacy
          </h1>

          <div className="flex flex-wrap items-center gap-3">

            <button
              onClick={() => setActivePage('dashboard')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activePage === 'dashboard'
                  ? 'bg-white text-green-900'
                  : 'hover:bg-green-800'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActivePage('medicine')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activePage === 'medicine'
                  ? 'bg-white text-green-900'
                  : 'hover:bg-green-800'
              }`}
            >
              Medicines
            </button>

            <button
              onClick={() => setActivePage('expiry')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activePage === 'expiry'
                  ? 'bg-white text-green-900'
                  : 'hover:bg-green-800'
              }`}
            >
              Expiry Alerts
            </button>

            <span className="text-green-100">
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="bg-white text-green-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
            >
              Logout
            </button>

          </div>

        </nav>

        {/* Main Content */}
        <main className="p-6">

          {activePage === 'dashboard' ? (

            <div className="bg-white rounded-2xl shadow-lg p-8">

              <h2 className="text-3xl font-bold text-green-900">
                Welcome, {user.name}! 🎉
              </h2>

              <p className="text-gray-600 mt-3">
                Welcome to Smart Pharmacy Management System.
              </p>

              {/* Dashboard Cards */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Medicines */}
                <button
                  onClick={() => setActivePage('medicine')}
                  className="bg-green-50 p-6 rounded-xl text-left hover:bg-green-100 transition"
                >
                  <h3 className="text-lg font-semibold text-green-900">
                    💊 Medicines
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Add, update and manage medicines.
                  </p>

                  <p className="mt-4 text-green-700 font-semibold">
                    Manage Medicines →
                  </p>
                </button>

                {/* Inventory */}
                <button
                  onClick={() => setActivePage('medicine')}
                  className="bg-blue-50 p-6 rounded-xl text-left hover:bg-blue-100 transition"
                >
                  <h3 className="text-lg font-semibold text-blue-900">
                    📦 Inventory
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Monitor medicine stock levels.
                  </p>

                  <p className="mt-4 text-blue-700 font-semibold">
                    View Inventory →
                  </p>
                </button>

                {/* Expiry Alerts */}
                <button
                  onClick={() => setActivePage('expiry')}
                  className="bg-orange-50 p-6 rounded-xl text-left hover:bg-orange-100 transition"
                >
                  <h3 className="text-lg font-semibold text-orange-900">
                    ⚠️ Expiry Alerts
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Monitor expired and upcoming expiry medicines.
                  </p>

                  <p className="mt-4 text-orange-700 font-semibold">
                    Check Expiry Alerts →
                  </p>
                </button>

              </div>

            </div>

          ) : activePage === 'medicine' ? (

            <Medicine />

          ) : activePage === 'expiry' ? (

            <ExpiryAlerts />

          ) : null}

        </main>

      </div>
    );
  }

  // Login Page
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Left Side */}
      <div className="hidden md:flex md:w-1/2 bg-green-900 text-white flex-col justify-center items-center p-12">

        <div className="text-6xl mb-6">
          💊
        </div>

        <h1 className="text-4xl font-bold mb-4">
          Smart Pharmacy
        </h1>

        <p className="text-green-200 text-center text-lg">
          Smart Inventory Management
          <br />
          Better Healthcare Management
        </p>

      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6">

        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

          <div className="md:hidden text-center mb-6">
            <h1 className="text-2xl font-bold text-green-900">
              💊 Smart Pharmacy
            </h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back!
          </h2>

          <p className="text-gray-500 mt-2 mb-8">
            Login to your pharmacy dashboard
          </p>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg p-3 mb-5 outline-none focus:ring-2 focus:ring-green-600"
            />

            {/* Password */}
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>

            <div className="relative mb-5">

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full border border-gray-300 rounded-lg p-3 pr-20 outline-none focus:ring-2 focus:ring-green-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-green-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>

            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

          <p className="text-center text-gray-400 text-sm mt-8">
            Smart Pharmacy Management System
          </p>

        </div>

      </div>

    </div>
  );
}

export default App;