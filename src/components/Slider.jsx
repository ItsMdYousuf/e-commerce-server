import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Slider = () => {
  const [title, setTitle] = useState("");
  const [sliderImage, setSliderImage] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const fileInputRef = useRef(null);
  const serverUrl = "http://localhost:5000";

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
      const response = await fetch(`${serverUrl}/sliders`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch sliders: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      setSliders(data);
    } catch (error) {
      toast.error(error.message); // Show error from fetch
      console.error("Fetch Sliders Error:", error); // Log for detailed debugging
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
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
    if (!sliderImage) {
      toast.error("Please select an image");
      return; // Stop upload
    }
    if (!title) {
      toast.error("Please provide a title");
      return; // Stop upload
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("sliderImage", sliderImage);
    formData.append("title", title);

    try {
      const response = await fetch(`${serverUrl}/sliders`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (jsonError) {
          console.error("JSON Parse Error:", jsonError);
        }
        throw new Error(errorMessage);
      }
      const newSlider = await response.json();
      toast.success("Slider uploaded successfully!");
      setTitle("");
      setSliderImage(null);
      setPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSliders((prevSliders) => [...prevSliders, newSlider]);
    } catch (error) {
      toast.error(error.message);
      console.error("Upload Error:", error); // Log the error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${serverUrl}/sliders/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        let errorMessage = `Delete failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (jsonError) {
          console.error("JSON Parse Error:", jsonError);
        }
        throw new Error(errorMessage);
      }
      await response.json();
      toast.success("Slider deleted successfully!");
      setDeleteId(null);
      setSliders((prevSliders) =>
        prevSliders.filter((slider) => slider._id !== id),
      );
    } catch (error) {
      toast.error(error.message);
      console.error("Delete Error:", error); // Log the error
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
              className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
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
                  src={`${serverUrl}${slider.image}`}
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
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteId(slider._id)}
                    className="rounded-full bg-red-500/90 p-1 text-white hover:bg-red-600" // Added rounded-full and padding
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold">Confirm Delete</h2>
              <p className="mb-4 text-gray-700">
                Are you sure you want to delete this slider?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  variant="secondary"
                  onClick={() => setDeleteId(null)}
                  className="rounded px-4 py-2 text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  variant="destructive"
                  onClick={() => {
                    if (deleteId) {
                      handleDelete(deleteId);
                    }
                  }}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
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

export default Slider;
