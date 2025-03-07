import React, { useEffect, useState } from "react";
import { FiEdit, FiEye, FiPlus, FiSearch, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import { ServerURL } from "../../SeerverDepen";

const ManageProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [products, setProducts] = useState([]);
  const productsData = ServerURL + "/products";

  useEffect(() => {
    fetch(productsData)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productsData]);

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
  ];
  const statusOptions = ["All", "Published", "Draft", "Archived"];

  const handleDelete = (_id) => {
    setProducts(products.filter((product) => product._id !== _id));
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for:`, selectedProducts);
    setSelectedProducts([]);
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((product) => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const filteredProducts = products.filter((product) => {
    // Use API field names and ensure text comparisons are in lower case
    const title = product.productTitle.toLowerCase();
    const sku = product.sku.toLowerCase();
    const category = product.productCategory.toLowerCase();
    // Assume a default status if not provided
    const status = product.status ? product.status.toLowerCase() : "published";

    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      sku.includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800 md:mb-0">
            Manage Products
          </h1>
          <Link
            to="../products/addNewProduct"
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FiPlus className="mr-2" />
            Add New Product
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-md border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              className="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center space-x-4">
              <select
                className="rounded-md border px-3 py-1"
                onChange={(e) => handleBulkAction(e.target.value)}
                disabled={selectedProducts.length === 0}
              >
                <option value="">Bulk Actions</option>
                <option value="delete">Delete</option>
                <option value="publish">Publish</option>
                <option value="archive">Archive</option>
              </select>
              <span className="text-sm text-gray-600">
                {selectedProducts.length} selected
              </span>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      selectedProducts.length === products.length &&
                      products.length > 0
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentProducts.map((product) => {
                // Use default status if missing
                const productStatus = product.status || "published";
                return (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([
                              ...selectedProducts,
                              product._id,
                            ]);
                          } else {
                            setSelectedProducts(
                              selectedProducts.filter(
                                (id) => id !== product._id,
                              ),
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={ServerURL + product.image}
                          alt={product.productTitle}
                          className="mr-4 h-10 w-10 rounded-md object-cover"
                        />
                        <span className="font-medium">
                          {product.productTitle}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.sku}</td>
                    <td className="px-6 py-4">${product.productAmount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-sm ${
                          product.stockQuantity > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">{product.productCategory}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-sm capitalize ${
                          productStatus === "published"
                            ? "bg-blue-100 text-blue-800"
                            : productStatus === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {productStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FiEye size={18} />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <FiEdit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(product._id)}
                        >
                          <FiTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-6 py-4">
            <span className="text-sm text-gray-600">
              Showing {indexOfFirstProduct + 1} to{" "}
              {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
              {filteredProducts.length} results
            </span>
            <div className="flex space-x-2">
              {Array.from(
                {
                  length: Math.ceil(filteredProducts.length / productsPerPage),
                },
                (_, i) => (
                  <button
                    key={i + 1}
                    className={`rounded-md px-3 py-1 ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
