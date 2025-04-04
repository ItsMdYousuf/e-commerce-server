import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LocalhostAPI } from "../../LocalhostAPI";

const ProductView = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    fetch(`${LocalhostAPI}/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        // Parse variants if it's a string
        if (data.variants && typeof data.variants === "string") {
          try {
            data.variants = JSON.parse(data.variants);
          } catch (error) {
            console.error("Error parsing variants:", error);
            data.variants = [];
          }
        }

        // Parse dimensions if it's a string
        if (data.dimensions && typeof data.dimensions === "string") {
          try {
            data.dimensions = JSON.parse(data.dimensions);
          } catch (error) {
            console.error("Error parsing dimensions:", error);
            data.dimensions = {};
          }
        }

        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setProduct(null);
      });
  }, [productId]);

  if (!product) return <div className="py-10 text-center">Loading...</div>;

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={`${LocalhostAPI}${product.image}`}
            alt={product.productTitle}
            className="w-full max-w-md rounded-lg object-cover shadow-lg"
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

            {/* Dimensions Table */}
            {product.dimensions && typeof product.dimensions === "object" && (
              <div>
                <h3 className="font-semibold">Dimensions:</h3>
                <table className="mt-2 min-w-[200px] table-auto border border-gray-300 text-sm">
                  <thead className="table-auto">
                    <tr className="bg-slate-200">
                      <th className="border px-4 py-2 text-left">Property</th>
                      <th className="border px-4 py-2 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody className="table-auto">
                    {Object.entries(product.dimensions).map(([key, value]) => (
                      <tr key={key}>
                        <td className="border px-4 py-2 capitalize">{key}</td>
                        <td className="border px-4 py-2">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
