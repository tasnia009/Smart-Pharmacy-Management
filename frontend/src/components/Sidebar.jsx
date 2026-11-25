const navigationItems = [
  'Dashboard',
  'Medicines',
  'Inventory',
  'Sales',
  'Customers',
  'Suppliers',
  'Reports',
  'Settings',
]

function Sidebar() {
  return (
    <aside className="w-64 bg-green-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">Smart Pharmacy</h1>

      <nav aria-label="Main navigation" className="space-y-5">
        {navigationItems.map((item) => (
          <p
            key={item}
            className={item === 'Dashboard' ? 'text-green-300 font-semibold' : undefined}
          >
            {item}
          </p>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar