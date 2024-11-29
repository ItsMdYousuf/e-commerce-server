import React, { useState } from "react";
import toast from "react-hot-toast";
import Button from "./Button";
import InputField from "./Input/InputField";
const Slider = () => {
  const [sliderFormData, setSliderFormData] = useState({
    statusName: "",
    subTitle: "",
    title: "",
    buttonName: "",
    buttonURL: "",
    imageURL: "",
  });

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setSliderFormData({
      ...sliderFormData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Successfully post slider!");
    console.log("submit: ", sliderFormData);
  };

  return (
    <div className="p-4">
      <h2 className="font-semibold">Slider Add</h2>
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
          <InputField
            labelName="Student Name"
            name="statusName"
            value={sliderFormData.statusName}
            onChange={handleSliderChange}
            type="text"
            placeholder="Product Status Name"
          />
          <InputField
            labelName="Sub Title Name"
            name="subTitle"
            value={sliderFormData.subTitle}
            onChange={handleSliderChange}
            type="text"
            placeholder="Product sub title"
          />
          <InputField
            labelName="Product Title"
            name="title"
            value={sliderFormData.title}
            onChange={handleSliderChange}
            type="text"
            placeholder="Product title"
          />
          <InputField
            labelName="Button Name"
            name="buttonName"
            value={sliderFormData.buttonName}
            onChange={handleSliderChange}
            type="text"
            placeholder="Product Button name"
          />
          <InputField
            labelName="button url"
            name="buttonURL"
            value={sliderFormData.buttonURL}
            onChange={handleSliderChange}
            type="text"
            placeholder="Product Button url"
          />
          <InputField
            labelName="Product URL"
            name="imageURL"
            value={sliderFormData.imageURL}
            onChange={handleSliderChange}
            type="text"
            placeholder="Product image url"
          />
        </div>
        <Button className="mt-3" children="submit" />
      </form>
    </div>
  );
};

export default Slider;
