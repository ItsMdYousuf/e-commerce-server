import React, { useCallback, useEffect, useState } from "react";
// Importing icons from lucide-react
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader,
  MoreVertical,
  PackageCheck,
  PackageX,
  RefreshCw,
  Trash2,
} from "lucide-react";

// API endpoint (ensure your backend server is running and accessible)
const API_URL = "http://localhost:5000/orders"; // Replace if your API is hosted elsewhere

// Helper function to format date (adjust format as needed)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";
  }
};

// Helper function to format currency
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "N/A";
  return `$${amount.toFixed(2)}`;
};

// Component for status badges with icons and colors
const StatusBadge = ({ status }) => {
  let bgColor, textColor, Icon;

  switch (status?.toLowerCase()) {
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      Icon = Clock;
      break;
    case "processing":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      Icon = Loader; // Using Loader icon for processing
      break;
    case "completed":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      Icon = PackageCheck;
      break;
    case "cancelled": // Assuming 'cancelled' is a possible status
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      Icon = PackageX;
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      Icon = AlertCircle; // Default icon for unknown status
      status = "unknown"; // Ensure status text is consistent
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}
    >
      <Icon className="mr-1.5 h-4 w-4" />
      {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
      {/* Capitalize first letter */}
    </span>
  );
};

// Main Order Management Component
function Order() {
  // State variables
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Tracks which order's action menu is open

  // Callback function to fetch orders from the API
  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    setSelectedOrderId(null); // Close any open action menus when refetching
    console.log(`Fetching orders for page: ${page}`); // Debug log

    try {
      // Construct the URL with the page query parameter
      const url = `${API_URL}?page=${page}`;
      const response = await fetch(url);

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response Data:", data); // Debug log

      // Validate data structure
      if (
        !data ||
        !Array.isArray(data.data) ||
        typeof data.totalPages === "undefined"
      ) {
        console.error("Invalid data structure received:", data);
        throw new Error("Invalid data structure received from API.");
      }

      // Update state with fetched data
      setOrders(data.data);
      setPagination({
        page: data.page || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      });
    } catch (err) {
      console.error("Failed to fetch orders:", err); // Log the detailed error
      setError(
        `Failed to fetch orders. Please ensure the API server at ${API_URL} is running and accessible. Error: ${err.message}`,
      );
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  }, []); // No dependencies needed if API_URL is constant

  // Fetch orders on initial component mount and when the page changes
  useEffect(() => {
    fetchOrders(pagination.page);
  }, [fetchOrders, pagination.page]); // Rerun effect if fetchOrders or page changes

  // Function to handle updating the status of an order
  const handleUpdateStatus = async (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to status ${newStatus}`); // Debug log
    setSelectedOrderId(null); // Close the action menu immediately

    // Find the current order to potentially revert on failure (optional)
    const originalOrders = [...orders];
    // Optimistically update the UI
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order,
      ),
    );

    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        // Assuming PUT/PATCH endpoint structure
        method: "PATCH", // Or 'PUT', depending on your API design
        headers: {
          "Content-Type": "Orderlication/json",
        },
        body: JSON.stringify({ status: newStatus }), // Send only the status update
      });

      if (!response.ok) {
        // Revert optimistic update on failure
        setOrders(originalOrders);
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      // Optionally, re-fetch the specific order or the entire list to confirm update
      // await fetchOrders(pagination.page); // Or fetch just the updated order if API supports it

      console.log(`Order ${orderId} status updated successfully.`); // Success log
    } catch (err) {
      console.error(`Failed to update status for order ${orderId}:`, err);
      setError(`Failed to update status for order ${orderId}. ${err.message}`);
      // Revert optimistic update (already done above)
      setOrders(originalOrders);
    }
  };

  // Function to handle deleting an order
  const handleDeleteOrder = async (orderId) => {
    console.log(`Attempting to delete order ${orderId}`); // Debug log
    setSelectedOrderId(null); // Close the action menu

    // Confirmation dialog before deleting
    if (
      !window.confirm(
        `Are you sure you want to delete order ${orderId}? This action cannot be undone.`,
      )
    ) {
      console.log("Deletion cancelled by user."); // Debug log
      return; // Stop if user cancels
    }

    // Optimistically remove from UI
    const originalOrders = [...orders];
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId),
    );
    // Adjust total count optimistically (optional, depends if you show total)
    setPagination((prev) => ({
      ...prev,
      total: prev.total > 0 ? prev.total - 1 : 0,
    }));

    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        // Assuming DELETE endpoint structure
        method: "DELETE",
      });

      if (!response.ok) {
        // Revert optimistic update on failure
        setOrders(originalOrders);
        setPagination((prev) => ({ ...prev, total: prev.total + 1 })); // Revert total count
        throw new Error(`Failed to delete order: ${response.statusText}`);
      }

      console.log(`Order ${orderId} deleted successfully.`); // Success log
      // Optional: If the deleted item was the last on the page and it's not page 1, go to previous page
      if (orders.length === 1 && pagination.page > 1) {
        handlePageChange(pagination.page - 1);
      } else if (orders.length === 1 && pagination.page === 1) {
        // If it was the only order overall, refetch might show an empty list
        fetchOrders(1);
      }
      // Otherwise, the optimistic update is likely sufficient, or refetch if needed:
      // await fetchOrders(pagination.page);
    } catch (err) {
      console.error(`Failed to delete order ${orderId}:`, err);
      setError(`Failed to delete order ${orderId}. ${err.message}`);
      // Revert optimistic update (already done above)
      setOrders(originalOrders);
      setPagination((prev) => ({ ...prev, total: prev.total + 1 })); // Revert total count
    }
  };

  // Function to handle changing the current page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      // The useEffect hook will trigger fetchOrders with the new page number
    }
  };

  // Toggle the action dropdown menu for a specific order
  const toggleActions = (orderId) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  // Render the component UI
  return (
    <div className="container mx-auto min-h-screen bg-gray-50 p-4 font-sans md:p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800 md:text-3xl">
        Order Management
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-600">Loading orders...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div
          className="relative mb-6 rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="ml-2 block sm:inline">{error}</span>
          <button
            onClick={() => fetchOrders(pagination.page)}
            className="ml-4 rounded-md bg-red-600 px-2 py-1 text-sm text-white transition-colors hover:bg-red-700"
            aria-label="Retry fetching orders"
          >
            Retry
          </button>
        </div>
      )}

      {/* Orders Table (only render if not loading and no critical error preventing data display) */}
      {!loading && !error && orders.length === 0 && (
        <div className="py-10 text-center text-gray-500">No orders found.</div>
      )}

      {!loading && orders.length > 0 && (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Payment
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Items
                  </th>
                  <th scope="col" className="relative px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td
                      className="truncate whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900"
                      title={order._id}
                    >
                      #{order._id.slice(-6)} {/* Show last 6 chars */}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      <div className="font-medium">
                        {order.customerInfo?.name || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customerInfo?.email || ""}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-600">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm capitalize text-gray-600">
                      {order.paymentStatus || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {order.items?.length || 0} item(s)
                      {/* Optional: Add a tooltip or modal to show item details */}
                      {order.items && order.items.length > 0 && (
                        <div
                          className="max-w-[150px] truncate text-xs text-gray-500"
                          title={order.items
                            .map((item) => `${item.title} (x${item.quantity})`)
                            .join(", ")}
                        >
                          {order.items.map((item) => item.title).join(", ")}
                        </div>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                      {/* Action Button - Toggles Dropdown */}
                      <button
                        onClick={() => toggleActions(order._id)}
                        className="rounded-full p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        aria-haspopup="true"
                        aria-expanded={selectedOrderId === order._id}
                        aria-label={`Actions for order ${order._id.slice(-6)}`}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {/* Action Dropdown Menu */}
                      {selectedOrderId === order._id && (
                        <div
                          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby={`menu-button-${order._id}`} // Use a unique ID if needed
                        >
                          <div className="py-1" role="none">
                            <p className="block px-4 py-2 text-xs text-gray-500">
                              Change Status:
                            </p>
                            {/* Status Update Actions */}
                            <button
                              onClick={() =>
                                handleUpdateStatus(order._id, "pending")
                              }
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                              role="menuitem"
                              disabled={order.status === "pending"} // Disable if already this status
                            >
                              Mark as Pending
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(order._id, "processing")
                              }
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                              role="menuitem"
                              disabled={order.status === "processing"}
                            >
                              Mark as Processing
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(order._id, "completed")
                              }
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                              role="menuitem"
                              disabled={order.status === "completed"}
                            >
                              Mark as Completed
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(order._id, "cancelled")
                              }
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                              role="menuitem"
                              disabled={order.status === "cancelled"}
                            >
                              Mark as Cancelled
                            </button>
                            <div className="my-1 border-t border-gray-100"></div>
                            {/* Delete Action */}
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                              role="menuitem"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Order
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                {/* Mobile Pagination */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                {/* Desktop Pagination */}
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{pagination.page}</span>{" "}
                    of{" "}
                    <span className="font-medium">{pagination.totalPages}</span>
                    <span className="ml-2">
                      ({pagination.total} total orders)
                    </span>
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {/* Add page number buttons here if needed - for simplicity, only Prev/Next shown */}
                    <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                      {pagination.page}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Order;
