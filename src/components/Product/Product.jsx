import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
const Product = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productFormData, setProductFormData] = useState({
    productTitle: "",
    productAmount: "",
    productDescription: "",
    productCategory: "",
    productTags: "",
    productBrand: "",
    sku: "",
    weight: "",
    warrantyInfo: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    Object.entries(productFormData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (imageFile) {
      formData.append("productImage", imageFile);
    }

    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Product added:", result);
      toast.success("Product added successfully!");

      setProductFormData({
        productTitle: "",
        productAmount: "",
        productDescription: "",
        productCategory: "",
        productTags: "",
        productBrand: "",
        sku: "",
        weight: "",
        warrantyInfo: "",
      });
      setImageFile(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message);
      toast.error("Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Toaster position="top-right" />
      <h2>Add Product Page</h2>

      <div className="flex w-full items-center justify-center">
        <div className="w-[14rem] bg-slate-300">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="h-52 w-full object-cover"
            />
          ) : (
            <div className="h-52 w-full bg-slate-600"></div>
          )}
          <h2>{productFormData.productTitle}</h2>
          <div>${productFormData.productAmount}</div>
        </div>
      </div>

      <div className="mt-5">
        <form onSubmit={handleProductSubmit}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium">Product Image</label>
              <input
                type="file"
                name="productImage"
                onChange={handleImageChange}
                className="rounded border p-2"
                accept="image/*"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium">Product Title</label>
              <input
                type="text"
                name="productTitle"
                value={productFormData.productTitle}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    productTitle: e.target.value,
                  })
                }
                className="rounded border p-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium">Product Amount</label>
              <input
                type="number"
                name="productAmount"
                value={productFormData.productAmount}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    productAmount: e.target.value,
                  })
                }
                className="rounded border p-2"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-5 rounded bg-blue-500 px-4 py-2 text-white"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Product;
