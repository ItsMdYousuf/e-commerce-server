import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalhostAPI } from "../LocalhostAPI";

const Slider = () => {
  const [title, setTitle] = useState("");
  const [sliderImage, setSliderImage] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const fetchSliders = async () => {
    try {
      const res = await axios.get(`${LocalhostAPI}/sliders`);
      setSliders(res.data);
    } catch (error) {
      toast.error("Failed to fetch sliders");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setSliderImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!sliderImage) return toast.error("Please select an image");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("sliderImage", sliderImage);
    formData.append("title", title);

    try {
      await axios.post(`${LocalhostAPI}/sliders`, formData);
      toast.success("Slider uploaded successfully!");
      setTitle("");
      setSliderImage(null);
      setPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await fetchSliders();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${LocalhostAPI}sliders/${id}`);
      toast.success("Slider deleted successfully!");
      setDeleteId(null);
      fetchSliders();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-800">
          Slider Management
        </h1>

        {/* Upload Section */}
        <div className="mb-12 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-gray-700">
            Upload New Slider
          </h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter slider title"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Image Upload
                </label>
                <div className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-6 transition hover:border-blue-400">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    required
                  />
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-32 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-blue-500">Click to upload</span>
                      <p className="text-xs text-gray-400">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-white transition hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                "Upload Slider"
              )}
            </button>
          </form>
        </div>

        {/* Existing Sliders */}
        <h3 className="mb-6 text-2xl font-semibold text-gray-700">
          Existing Sliders
        </h3>
        {sliders.length === 0 ? (
          <p className="text-center text-gray-400">No sliders found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sliders.map((slider) => (
              <div
                key={slider._id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <img
                  src={`${LocalhostAPI}${slider.image}`}
                  alt={slider.title}
                  className="h-48 w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="truncate text-lg font-medium">
                    {slider.title}
                  </h4>
                </div>
                <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => setDeleteId(slider._id)}
                    className="rounded-lg bg-red-500/90 p-2 text-white transition hover:bg-red-600"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="m-4 rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete this slider?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="colored"
        progressStyle={{ backgroundColor: "rgba(255,255,255,0.5)" }}
      />
    </div>
  );
};

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export default Slider;
