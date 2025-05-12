import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ApiContext } from "../Context/ApiProvider";

const Product = () => {
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const { serverUrl } = useContext(ApiContext);
  const [productFormData, setProductFormData] = useState({
    productTitle: "",
    productAmount: "",
    productDescription: "",
    productCategory: "",
    productTags: [],
    productBrand: "",
    sku: "",
    weight: "",
    warrantyInfo: "",
    stockQuantity: "",
    dimensions: { length: "", width: "", height: "" },
    variants: [],
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      [{ align: [] }],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "color",
    "background",
    "align",
    "code-block",
  ];

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentTag, setCurrentTag] = useState("");

  // Categories fetching
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${serverUrl}/categories`);
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(`Error fetching categories: ${error.message}`);
      }
    };
    fetchCategories();
  }, [serverUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        setImageFile(null);
        setPreviewImage(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size must be less than 5MB");
        setImageFile(null);
        setPreviewImage(null);
        return;
      }
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreviewImage(null);
    }
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (currentTag.trim() && productFormData.productTags.length < 5) {
        setProductFormData({
          ...productFormData,
          productTags: [...productFormData.productTags, currentTag.trim()],
        });
        setCurrentTag("");
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setProductFormData({
      ...productFormData,
      productTags: productFormData.productTags.filter(
        (_, index) => index !== indexToRemove,
      ),
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !productFormData.productTitle ||
      !productFormData.productAmount ||
      !productFormData.stockQuantity ||
      !productFormData.productCategory
    ) {
      setError(
        "Please fill in all required fields (Product Title, Price, Category and Stock Quantity)",
      );
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(productFormData).forEach(([key, value]) => {
      if (key === "dimensions") {
        formData.append(key, JSON.stringify(value));
      } else if (key === "productTags") {
        value.forEach((tag) => formData.append("productTags", tag));
      } else {
        formData.append(key, value === undefined ? "" : value);
      }
    });

    if (imageFile) {
      formData.append("productImage", imageFile);
    }

    try {
      const response = await fetch(`${serverUrl}/products`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to add product";
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message; // Use the message from the server response.
          }
        } catch (parseError) {
          // If parsing JSON fails, fall back to generic error message
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(`${errorMessage} (HTTP status: ${response.status})`);
      }

      const result = await response.json();
      toast.success("Product added successfully!");
      // Reset form
      setProductFormData({
        ...productFormData,
        productTitle: "",
        productAmount: "",
        productDescription: "",
        productTags: [],
        sku: "",
        dimensions: { length: "", width: "", height: "" },
        stockQuantity: "",
      });
      setImageFile(null);
      setPreviewImage(null);
      if (quillRef.current) {
        quillRef.current.getEditor().setContents("");
      }
    } catch (error) {
      toast.error(`Failed to add product: ${error.message}`);
      console.error("Submission error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h2 className="mb-6 text-2xl font-bold">Add New Product</h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Upload Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Product Images</h3>
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="mb-4 h-64 w-full rounded-md object-contain"
              />
            ) : (
              <div className="mb-4 flex h-64 items-center justify-center rounded-lg bg-gray-100">
                <span className="text-gray-500">No image selected</span>
              </div>
            )}
            <label className="cursor-pointer rounded-md bg-blue-100 px-4 py-2 text-blue-700 hover:bg-blue-200">
              Upload Image
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">
              JPEG, PNG, or WEBP (Max 5MB)
            </p>
          </div>
        </div>

        {/* Product Preview */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Preview</h3>
          <div className="space-y-2">
            <h4 className="font-medium">
              {productFormData.productTitle || "Product Title"}
            </h4>
            <div className="text-xl font-bold">
              ${productFormData.productAmount || "0.00"}
            </div>
            {productFormData.productTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {productFormData.productTags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded bg-gray-100 px-2 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div
              className="prose text-gray-600"
              dangerouslySetInnerHTML={{
                __html: productFormData.productDescription,
              }}
            />
          </div>
        </div>
      </div>

      {/* Product Form */}
      <form
        onSubmit={handleProductSubmit}
        className="mt-8 rounded-lg bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Product Title *
              </label>
              <input
                type="text"
                value={productFormData.productTitle}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    productTitle: e.target.value,
                  })
                }
                className="w-full rounded-md border p-2"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>

              <div className="quill-editor mb-20">
                <ReactQuill
                  className="h-32"
                  ref={quillRef}
                  theme="snow"
                  value={productFormData.productDescription || ""}
                  onChange={(value) =>
                    setProductFormData({
                      ...productFormData,
                      productDescription: value,
                    })
                  }
                  modules={modules}
                  formats={formats}
                  placeholder="Write detailed product description..."
                />
              </div>
              <textarea
                value={productFormData.productDescription}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    productDescription: e.target.value,
                  })
                }
                rows="4"
                className="w-full rounded-md border p-2"
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
            <div>
              <label className="mb-1 block text-sm font-medium">Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={productFormData.productAmount}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      productAmount: e.target.value,
                    })
                  }
                  className="w-full rounded-md border p-2 pl-8"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">SKU</label>
              <input
                type="text"
                value={productFormData.sku}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    sku: e.target.value,
                  })
                }
                className="w-full rounded-md border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Stock Quantity *
              </label>
              <input
                type="number"
                value={productFormData.stockQuantity}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    stockQuantity: e.target.value,
                  })
                }
                className="w-full rounded-md border p-2"
                required
              />
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories & Tags</h3>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Category *
              </label>
              <select
                value={productFormData.productCategory}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    productCategory: e.target.value,
                  })
                }
                className="w-full rounded-md border p-2"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Tags (Max 5)
              </label>
              <div className="rounded-md border p-2">
                <div className="mb-2 flex flex-wrap gap-2">
                  {productFormData.productTags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder="Type and press enter to add tags"
                  className="w-full border-none p-1 focus:ring-0"
                  disabled={productFormData.productTags.length >= 5}
                />
              </div>
            </div>
          </div>

          {/* Shipping & Warranty */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping & Warranty</h3>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={productFormData.weight || ""}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    weight: e.target.value,
                  })
                }
                className="w-full rounded-md border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Length"
                  value={productFormData.dimensions.length || ""}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      dimensions: {
                        ...productFormData.dimensions,
                        length: e.target.value,
                      },
                    })
                  }
                  className="rounded-md border p-2"
                />
                <input
                  type="number"
                  placeholder="Width"
                  value={productFormData.dimensions.width || ""}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      dimensions: {
                        ...productFormData.dimensions,
                        width: e.target.value,
                      },
                    })
                  }
                  className="rounded-md border p-2"
                />
                <input
                  type="number"
                  placeholder="Height"
                  value={productFormData.dimensions.height || ""}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      dimensions: {
                        ...productFormData.dimensions,
                        height: e.target.value,
                      },
                    })
                  }
                  className="rounded-md border p-2"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Warranty Information
              </label>
              <input
                type="text"
                value={productFormData.warrantyInfo || ""}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    warrantyInfo: e.target.value,
                  })
                }
                className="w-full rounded-md border p-2"
                placeholder="e.g., 1 Year Manufacturer Warranty"
              />
            </div>
          </div>
        </div>

        {error && <div className="mt-4 text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default Product;
