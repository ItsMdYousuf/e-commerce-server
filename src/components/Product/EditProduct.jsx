import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ServerURL } from "../../SeerverDepen";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productTitle: "",
    sku: "",
    productAmount: 0,
    productCategory: "",
    description: "",
    stockQuantity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the product details when the component mounts
  useEffect(() => {
    axios
      .get(`${ServerURL}/products/${productId}`)
      .then((response) => {
        if (response.data && response.data.data) {
          setProduct(response.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product: ", err);
        setError("Error fetching product data");
        setLoading(false);
      });
  }, [productId]);

  // Handle changes in the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the updated product details
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${ServerURL}/products/${productId}`, product)
      .then((response) => {
        // Optionally, check the response for success
        navigate("/dashboard/products/manageProducts");
      })
      .catch((err) => {
        console.error("Error updating product: ", err);
        setError("Error updating product");
      });
  };

  if (loading) return <p>Loading product data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Product Title</label>
          <input
            type="text"
            name="productTitle"
            value={product.productTitle}
            onChange={handleChange}
            className="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">SKU</label>
          <input
            type="text"
            name="sku"
            value={product.sku}
            onChange={handleChange}
            className="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            name="productAmount"
            value={product.productAmount}
            onChange={handleChange}
            className="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            name="productCategory"
            value={product.productCategory}
            onChange={handleChange}
            className="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Stock Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            value={product.stockQuantity}
            onChange={handleChange}
            className="mt-1 block w-full rounded border p-2"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
