import { useState } from "react";

// Mock data
const mockOrders = [
  {
    id: "#3210",
    customer: "Olivia Martin",
    date: "2023-11-15",
    status: "Delivered",
    amount: "$42.25",
    payment: "Credit Card",
    items: 2,
    shipping: "Express",
    address: "123 Main St, New York, NY 10001",
  },
  // Add more mock orders...
];

const statusStyles = {
  Delivered: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-red-100 text-red-800",
  Processing: "bg-blue-100 text-blue-800",
};

export default function Order() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    startDate: "",
    endDate: "",
    searchQuery: "",
  });

  const [showModal, setShowModal] = useState(false);

  // Filter orders based on filters
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filters.status === "all" || order.status === filters.status;
    const matchesDate =
      (!filters.startDate ||
        new Date(order.date) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(order.date) <= new Date(filters.endDate));
    const matchesSearch =
      order.customer
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(filters.searchQuery.toLowerCase());
    return matchesStatus && matchesDate && matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">1,234</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">$24,567</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <select
            className="rounded-md border-gray-300 shadow-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Statuses</option>
            {Object.keys(statusStyles).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="rounded-md border-gray-300 shadow-sm"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />

          <input
            type="date"
            className="rounded-md border-gray-300 shadow-sm"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />

          <input
            type="search"
            placeholder="Search orders..."
            className="rounded-md border-gray-300 shadow-sm"
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters({ ...filters, searchQuery: e.target.value })
            }
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowModal(true);
                }}
              >
                <td className="whitespace-nowrap px-6 py-4">{order.id}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {order.customer}
                </td>
                <td className="whitespace-nowrap px-6 py-4">{order.date}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Order Details - {selectedOrder.id}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Customer Information</h3>
                <p className="text-gray-600">{selectedOrder.customer}</p>
                <p className="text-gray-600">{selectedOrder.address}</p>
              </div>

              <div>
                <h3 className="font-medium">Order Information</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Date: {selectedOrder.date}</p>
                    <p className="text-gray-600">
                      Status: {selectedOrder.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      Payment Method: {selectedOrder.payment}
                    </p>
                    <p className="text-gray-600">
                      Shipping Method: {selectedOrder.shipping}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Items</h3>
                {/* Add items list here */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
