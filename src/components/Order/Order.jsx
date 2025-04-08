import React, { useCallback, useEffect, useState } from 'react';
// Importing icons from lucide-react
import { AlertCircle, ChevronLeft, ChevronRight, Clock, Loader, MoreVertical, PackageCheck, PackageX, RefreshCw, Trash2 } from 'lucide-react';

// API endpoint (ensure your backend server is running and accessible)
const API_URL = 'http://localhost:5000/orders'; // Replace if your API is hosted elsewhere

// Helper function to format date (adjust format as needed)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Invalid Date';
  }
};

// Helper function to format currency
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return 'N/A';
  return `$${amount.toFixed(2)}`;
};

// Component for status badges with icons and colors
const StatusBadge = ({ status }) => {
  let bgColor, textColor, Icon;

  switch (status?.toLowerCase()) {
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      Icon = Clock;
      break;
    case 'processing':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      Icon = Loader; // Using Loader icon for processing
      break;
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      Icon = PackageCheck;
      break;
    case 'cancelled': // Assuming 'cancelled' is a possible status
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      Icon = PackageX;
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      Icon = AlertCircle; // Default icon for unknown status
      status = 'unknown'; // Ensure status text is consistent
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      <Icon className="w-4 h-4 mr-1.5" />
      {status.charAt(0).toUpperCase() + status.slice(1)} {/* Capitalize first letter */}
    </span>
  );
};

// Main Order Management Component
function Order() {
  // State variables
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
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
      if (!data || !Array.isArray(data.data) || typeof data.totalPages === 'undefined') {
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
      setError(`Failed to fetch orders. Please ensure the API server at ${API_URL} is running and accessible. Error: ${err.message}`);
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
    setOrders(prevOrders =>
        prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
        )
    );

    try {
      const response = await fetch(`${API_URL}/${orderId}`, { // Assuming PUT/PATCH endpoint structure
        method: 'PATCH', // Or 'PUT', depending on your API design
        headers: {
          'Content-Type': 'application/json',
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
    if (!window.confirm(`Are you sure you want to delete order ${orderId}? This action cannot be undone.`)) {
      console.log("Deletion cancelled by user."); // Debug log
      return; // Stop if user cancels
    }

    // Optimistically remove from UI
    const originalOrders = [...orders];
    setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
    // Adjust total count optimistically (optional, depends if you show total)
    setPagination(prev => ({ ...prev, total: prev.total > 0 ? prev.total - 1 : 0 }));


    try {
      const response = await fetch(`${API_URL}/${orderId}`, { // Assuming DELETE endpoint structure
        method: 'DELETE',
      });

      if (!response.ok) {
         // Revert optimistic update on failure
        setOrders(originalOrders);
        setPagination(prev => ({ ...prev, total: prev.total + 1 })); // Revert total count
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
       setPagination(prev => ({ ...prev, total: prev.total + 1 })); // Revert total count
    }
  };

  // Function to handle changing the current page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      // The useEffect hook will trigger fetchOrders with the new page number
    }
  };

  // Toggle the action dropdown menu for a specific order
  const toggleActions = (orderId) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  // Render the component UI
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Order Management</h1>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-600">Loading orders...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <button
            onClick={() => fetchOrders(pagination.page)}
            className="ml-4 py-1 px-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
            aria-label="Retry fetching orders"
          >
            Retry
          </button>
        </div>
      )}

      {/* Orders Table (only render if not loading and no critical error preventing data display) */}
      {!loading && !error && orders.length === 0 && (
         <div className="text-center py-10 text-gray-500">No orders found.</div>
      )}

      {!loading && orders.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Order ID</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Payment</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Items</th>
                   <th scope="col" className="relative px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate" title={order._id}>
                      #{order._id.slice(-6)} {/* Show last 6 chars */}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="font-medium">{order.customerInfo?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{order.customerInfo?.email || ''}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {order.paymentStatus || 'N/A'}
                     </td>
                     <td className="px-4 py-4 text-sm text-gray-600">
                        {order.items?.length || 0} item(s)
                        {/* Optional: Add a tooltip or modal to show item details */}
                        {order.items && order.items.length > 0 && (
                            <div className="text-xs text-gray-500 truncate max-w-[150px]" title={order.items.map(item => `${item.title} (x${item.quantity})`).join(', ')}>
                                {order.items.map(item => item.title).join(', ')}
                            </div>
                        )}
                     </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      {/* Action Button - Toggles Dropdown */}
                      <button
                        onClick={() => toggleActions(order._id)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
                        aria-haspopup="true"
                        aria-expanded={selectedOrderId === order._id}
                        aria-label={`Actions for order ${order._id.slice(-6)}`}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {/* Action Dropdown Menu */}
                      {selectedOrderId === order._id && (
                        <div
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby={`menu-button-${order._id}`} // Use a unique ID if needed
                        >
                          <div className="py-1" role="none">
                            <p className="block px-4 py-2 text-xs text-gray-500">Change Status:</p>
                            {/* Status Update Actions */}
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'pending')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              role="menuitem"
                              disabled={order.status === 'pending'} // Disable if already this status
                            >
                              Mark as Pending
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'processing')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              role="menuitem"
                               disabled={order.status === 'processing'}
                            >
                              Mark as Processing
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'completed')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              role="menuitem"
                               disabled={order.status === 'completed'}
                            >
                              Mark as Completed
                            </button>
                             <button
                              onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              role="menuitem"
                               disabled={order.status === 'cancelled'}
                            >
                              Mark as Cancelled
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            {/* Delete Action */}
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                              role="menuitem"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
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
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
              <div className="flex-1 flex justify-between sm:hidden">
                {/* Mobile Pagination */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                {/* Desktop Pagination */}
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{pagination.page}</span> of <span className="font-medium">{pagination.totalPages}</span>
                    <span className="ml-2">({pagination.total} total orders)</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {/* Add page number buttons here if needed - for simplicity, only Prev/Next shown */}
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      {pagination.page}
                    </span>
                     <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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