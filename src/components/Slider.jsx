import React, { useState } from "react";
import toast from "react-hot-toast";
import { LocalhostAPI } from "../LocalhostAPI";
import Button from "./Button";
import InputField from "./Input/InputField";

const Slider = () => {
  const [sliderFormData, setSliderFormData] = useState({
    title: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setSliderFormData((prev) => ({ ...prev, image: file }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setSliderFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!sliderFormData.image) {
      toast.error("Please select an image file");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", sliderFormData.title);
    formData.append("sliderImage", sliderFormData.image);

    try {
      const response = await fetch(`${LocalhostAPI}/sliders`, {
        method: "POST",
        body: formData,
        // Headers are automatically set by browser for FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Slider uploaded successfully!");
      console.log("Upload response:", data);

      // Reset form after successful submission
      setSliderFormData({ title: "", image: null });
      document.querySelector('input[type="file"]').value = ""; // Clear file input
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload slider");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-semibold">Add Slider Image</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-4">
          <InputField
            labelName="Slider Title"
            name="title"
            value={sliderFormData.title}
            onChange={handleTextChange}
            type="text"
            placeholder="Enter slider title"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Slider Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          <Button
            type="submit"
            className="mt-4 w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Upload Slider"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Slider;
