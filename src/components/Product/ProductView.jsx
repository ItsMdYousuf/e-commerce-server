import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductView = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        // If variants is a string, try to parse it into an array.
        if (data.variants && typeof data.variants === "string") {
          try {
            data.variants = JSON.parse(data.variants);
          } catch (error) {
            console.error("Error parsing variants:", error);
            data.variants = [];
          }
        }
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]); // Set first variant as default
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setProduct(null);
      });
  }, [productId]);

  if (!product)
    return (
      <div className="py-10 text-center">Loading or product not found...</div>
    );

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.productTitle}
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.productTitle}</h1>
          <p className="text-2xl font-semibold text-gray-800">
            ${product.productAmount}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Variant:</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => handleVariantChange(variant)}
                    className={`rounded-lg border px-4 py-2 ${
                      selectedVariant === variant
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart and Buy Now Buttons */}
          <div className="flex gap-4">
            <button className="rounded-lg bg-blue-500 px-6 py-3 text-white transition hover:bg-blue-600">
              Add to Cart
            </button>
            <button className="rounded-lg bg-green-500 px-6 py-3 text-white transition hover:bg-green-600">
              Buy Now
            </button>
          </div>

          {/* Product Description */}
          <div className="prose">
            <div
              dangerouslySetInnerHTML={{ __html: product.productDescription }}
            />
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {product.productCategory}
            </p>
            <p>
              <span className="font-semibold">Brand:</span>{" "}
              {product.productBrand}
            </p>
            <p>
              <span className="font-semibold">SKU:</span> {product.sku}
            </p>
            <p>
              <span className="font-semibold">Weight:</span> {product.weight}
            </p>
            <p>
              <span className="font-semibold">Dimensions:</span>{" "}
              {product.dimensions}
            </p>
            <p>
              <span className="font-semibold">Warranty:</span>{" "}
              {product.warrantyInfo}
            </p>
            <p>
              <span className="font-semibold">Stock:</span>{" "}
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
