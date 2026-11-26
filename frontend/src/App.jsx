import { useState } from 'react';
import Medicine from './Medicine';
import ExpiryAlerts from './ExpiryAlerts';
import Sales from './Sales';

function App() {
  // Authentication States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [isRegister, setIsRegister] = useState(false);

  // LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // REGISTER FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Registration successful! Please login.');

      setIsRegister(false);
      setName('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('token');

    setUser(null);
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setActivePage('dashboard');
    setIsRegister(false);
    setError('');
    setSuccess('');
  };

  // SIDEBAR MENU
  const menuItems = [
    {
      id: 'dashboard',
      icon: '▦',
      label: 'Dashboard',
    },
    {
      id: 'medicine',
      icon: '💊',
      label: 'Medicines',
    },
    {
      id: 'sales',
      icon: '🛒',
      label: 'Sales & Billing',
    },
    {
      id: 'expiry',
      icon: '⚠️',
      label: 'Expiry Alerts',
    },
  ];

  // PAGE TITLE
  const pageTitle = {
    dashboard: 'Dashboard',
    medicine: 'Medicine Management',
    sales: 'Sales & Billing',
    expiry: 'Expiry Alerts',
  };

  // MAIN DASHBOARD
  if (user) {
    return (
      <div className="min-h-screen bg-slate-50 lg:flex">

        {/* SIDEBAR */}
        <aside className="bg-emerald-950 text-white lg:w-64 lg:min-h-screen">

          {/* LOGO */}
          <div className="p-6 border-b border-emerald-800">
            <h1 className="text-2xl font-bold">
              💊 Smart Pharmacy
            </h1>

            <p className="text-emerald-300 text-xs mt-2 tracking-wider">
              MANAGEMENT SYSTEM
            </p>
          </div>

          {/* NAVIGATION */}
          <div className="p-5">
            <p className="text-emerald-400 text-xs font-bold uppercase mb-4">
              Main Menu
            </p>

            <div className="flex lg:flex-col gap-2 overflow-x-auto">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition whitespace-nowrap ${
                    activePage === item.id
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-emerald-100 hover:bg-emerald-900'
                  }`}
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>

                  <span className="font-medium">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* SIDEBAR INFORMATION */}
          <div className="hidden lg:block p-5 mt-10">
            <div className="bg-emerald-900 rounded-xl p-4">
              <p className="font-semibold text-sm">
                Smart Pharmacy
              </p>

              <p className="text-emerald-300 text-xs mt-2">
                Smarter inventory, better healthcare.
              </p>
            </div>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">

          {/* TOP HEADER */}
          <header className="bg-white border-b border-gray-200 px-5 md:px-8 py-4 flex justify-between items-center">

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {pageTitle[activePage] || 'Dashboard'}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Smart Pharmacy Management System
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user.name}
                </p>

                <p className="text-xs text-emerald-600">
                  Administrator
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
              >
                Logout
              </button>

            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="p-5 md:p-8">

            {/* DASHBOARD PAGE */}
            {activePage === 'dashboard' ? (

              <div>

                {/* WELCOME SECTION */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-7 md:p-10 text-white shadow-lg">

                  <p className="text-emerald-100 text-sm font-medium">
                    WELCOME BACK
                  </p>

                  <h1 className="text-3xl md:text-4xl font-bold mt-3">
                    Hello, {user.name}! 👋
                  </h1>

                  <p className="text-emerald-100 mt-3">
                    Welcome to your Smart Pharmacy Dashboard.
                  </p>

                  <button
                    onClick={() => setActivePage('medicine')}
                    className="mt-6 bg-white text-emerald-800 px-5 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition"
                  >
                    Manage Medicines →
                  </button>

                </div>

                {/* SECTION TITLE */}
                <div className="mt-9 mb-5">
                  <h2 className="text-xl font-bold text-gray-800">
                    Pharmacy Management
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Manage your pharmacy operations from one place.
                  </p>
                </div>

                {/* MANAGEMENT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {/* MEDICINES CARD */}
                  <button
                    onClick={() => setActivePage('medicine')}
                    className="bg-white rounded-2xl p-6 text-left shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                  >
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-3xl">
                      💊
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mt-5">
                      Medicines
                    </h3>

                    <p className="text-gray-500 text-sm mt-2 leading-6">
                      Add, update, search and manage all your pharmacy medicines.
                    </p>

                    <p className="text-emerald-700 font-semibold text-sm mt-5">
                      Manage Medicines →
                    </p>
                  </button>

                  {/* SALES & BILLING CARD */}
                  <button
                    onClick={() => setActivePage('sales')}
                    className="bg-white rounded-2xl p-6 text-left shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                  >
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl">
                      🛒
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mt-5">
                      Sales & Billing
                    </h3>

                    <p className="text-gray-500 text-sm mt-2 leading-6">
                      Sell medicines, generate customer bills and manage transactions.
                    </p>

                    <p className="text-green-700 font-semibold text-sm mt-5">
                      Create New Sale →
                    </p>
                  </button>

                  {/* INVENTORY CARD */}
                  <button
                    onClick={() => setActivePage('medicine')}
                    className="bg-white rounded-2xl p-6 text-left shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                  >
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl">
                      📦
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mt-5">
                      Inventory
                    </h3>

                    <p className="text-gray-500 text-sm mt-2 leading-6">
                      Monitor medicine stock levels and maintain inventory records.
                    </p>

                    <p className="text-blue-700 font-semibold text-sm mt-5">
                      View Inventory →
                    </p>
                  </button>

                  {/* EXPIRY ALERTS CARD */}
                  <button
                    onClick={() => setActivePage('expiry')}
                    className="bg-white rounded-2xl p-6 text-left shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                  >
                    <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-3xl">
                      ⚠️
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mt-5">
                      Expiry Alerts
                    </h3>

                    <p className="text-gray-500 text-sm mt-2 leading-6">
                      Identify expired and upcoming expiry medicines.
                    </p>

                    <p className="text-orange-700 font-semibold text-sm mt-5">
                      Check Expiry Alerts →
                    </p>
                  </button>

                </div>

                {/* PHARMACY OVERVIEW */}
                <div className="mt-9 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

                  <h3 className="font-bold text-gray-800 text-lg">
                    Pharmacy Overview
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    Use the navigation menu to manage medicines, process sales, monitor inventory and check expiry alerts.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">

                    <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium">
                      ✓ Medicine Management
                    </span>

                    <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                      ✓ Sales & Billing
                    </span>

                    <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                      ✓ Inventory Monitoring
                    </span>

                    <span className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium">
                      ✓ Expiry Monitoring
                    </span>

                  </div>
                </div>

              </div>

            ) : activePage === 'medicine' ? (

              <Medicine />

            ) : activePage === 'sales' ? (

              <Sales />

            ) : activePage === 'expiry' ? (

              <ExpiryAlerts />

            ) : null}

          </main>
        </div>
      </div>
    );
  }

  // LOGIN AND REGISTRATION PAGE
  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* LEFT BRANDING SECTION */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700 text-white flex-col justify-center items-center p-12 relative overflow-hidden">

        <div className="absolute w-72 h-72 bg-emerald-500 opacity-10 rounded-full -top-20 -left-20"></div>

        <div className="absolute w-96 h-96 bg-emerald-300 opacity-10 rounded-full -bottom-32 -right-20"></div>

        <div className="relative z-10 max-w-md">

          <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center text-6xl mb-8 shadow-xl">
            💊
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-5">
            Smart Pharmacy
          </h1>

          <p className="text-emerald-100 text-lg leading-8">
            Manage your pharmacy smarter with an easy and modern management system.
          </p>

          {/* FEATURES */}
          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                📦
              </div>

              <div>
                <h3 className="font-semibold">
                  Medicine Management
                </h3>

                <p className="text-emerald-200 text-sm">
                  Organize your medicine inventory.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                📊
              </div>

              <div>
                <h3 className="font-semibold">
                  Inventory Monitoring
                </h3>

                <p className="text-emerald-200 text-sm">
                  Keep track of medicine stock.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                ⚠️
              </div>

              <div>
                <h3 className="font-semibold">
                  Expiry Alerts
                </h3>

                <p className="text-emerald-200 text-sm">
                  Monitor upcoming expiry dates.
                </p>
              </div>
            </div>

          </div>
        </div>

        <p className="absolute bottom-8 text-emerald-200 text-sm">
          Smart Pharmacy Management System © 2026
        </p>
      </div>

      {/* RIGHT LOGIN / REGISTER SECTION */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8">

        <div className="bg-white w-full max-w-md p-7 sm:p-10 rounded-3xl shadow-xl border border-gray-100">

          {/* MOBILE LOGO */}
          <div className="md:hidden text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3">
              💊
            </div>

            <h1 className="text-2xl font-bold text-emerald-900">
              Smart Pharmacy
            </h1>
          </div>

          {/* HEADING */}
          <div className="mb-8">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">
              {isRegister ? 'Get Started' : 'Welcome Back'}
            </p>

            <h2 className="text-3xl font-bold text-gray-800">
              {isRegister
                ? 'Create Account'
                : 'Login to Your Account'}
            </h2>

            <p className="text-gray-500 mt-3 text-sm">
              {isRegister
                ? 'Create your account to manage your pharmacy.'
                : 'Enter your details to access your pharmacy dashboard.'}
            </p>
          </div>

          {/* AUTHENTICATION FORM */}
          <form onSubmit={isRegister ? handleRegister : handleLogin}>

            {/* FULL NAME */}
            {isRegister && (
              <div className="mb-5">
                <label className="block text-gray-700 font-semibold text-sm mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>
            )}

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold text-sm mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold text-sm mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pr-20 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            {isRegister && (
              <div className="mb-5">
                <label className="block text-gray-700 font-semibold text-sm mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password again"
                  required
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl mb-5 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-3 rounded-xl mb-5 text-sm">
                ✓ {success}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-800 active:scale-[0.99] transition shadow-lg shadow-emerald-100 disabled:opacity-60"
            >
              {loading
                ? (isRegister
                    ? 'Creating Account...'
                    : 'Logging In...')
                : (isRegister
                    ? 'Create Account →'
                    : 'Login to Dashboard →')}
            </button>

          </form>

          {/* LOGIN / REGISTER SWITCH */}
          <div className="text-center mt-7">
            {isRegister ? (
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}

                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Login
                </button>
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}

                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                    setSuccess('');
                    setPassword('');
                  }}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Create Account
                </button>
              </p>
            )}
          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-100 mt-7 pt-5">
            <p className="text-center text-gray-400 text-xs">
              Secure Pharmacy Management System
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;