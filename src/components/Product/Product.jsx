import React, { useState } from "react";
import Button from "../Button";
import InputField from "../InputField";

const Product = () => {
  const [ProductFormData, setProductFormData] = useState({
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

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductFormData({
      ...ProductFormData,
      [name]: value,
    });
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    console.log(ProductFormData);
  };

  return (
    <div className="p-4">
      <div>
        <h2>Product Page</h2>
      </div>
      <div className="mt-5">
        <form onSubmit={handleProductSubmit}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
            <InputField
              type="text"
              name="productTitle"
              placeholder="Enter your Product title"
              onChange={handleProductChange}
            />
            <InputField
              type="text"
              name="productDescription"
              placeholder="Enter your Product Description"
              onChange={handleProductChange}
            />
            <InputField
              type="text"
              name="productCategory"
              placeholder="Enter your Product Category"
              onChange={handleProductChange}
            />
            <InputField
              type="number"
              name="productAmount"
              placeholder="Enter your Product amount"
              onChange={handleProductChange}
            />
            <InputField
              type="text"
              name="productTags"
              placeholder="Enter your Product tags"
              onChange={handleProductChange}
            />
            <InputField
              type="text"
              name="productBrand"
              placeholder="Enter your Product Brand"
              onChange={handleProductChange}
            />
            <InputField
              type="text"
              name="sku"
              placeholder="Enter your Product sku"
              onChange={handleProductChange}
            />
            <InputField
              type="text"
              name="weight"
              placeholder="Enter your Product weight"
              onChange={handleProductChange}
            />
          </div>
          <Button className="mt-5" children="Submit" />
        </form>
      </div>
    </div>
  );
};

export default Product;
