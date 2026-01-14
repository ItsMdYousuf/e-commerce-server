"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Slider = () => {
  const serverUrl = "https://ecommerce-backend-sand-eight.vercel.app";
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [sliders, setSliders] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef();

  const fetchSliders = async () => {
    try {
      const res = await fetch(`${serverUrl}/sliders`);
      const data = await res.json();
      setSliders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Could not load sliders.");
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !image) return toast.error("Title and Image are required");

    setIsUploading(true);
    const form = new FormData();
    form.append("title", title);
    form.append("image", image); // FIXED: Must match backend upload.single("image")

    try {
      const res = await fetch(`${serverUrl}/sliders`, {
        method: "POST",
        body: form, // Fetch automatically sets multipart/form-data boundary
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setSliders((prev) => [data, ...prev]);
      toast.success("Slider added successfully!");

      // Reset
      setTitle("");
      setImage(null);
      setPreview("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slider?")) return;
    try {
      const res = await fetch(`${serverUrl}/sliders/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setSliders((prev) => prev.filter((s) => s._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Slider Banners
        </h1>
        <p className="text-zinc-500">
          Add high-quality images for your homepage carousel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Form */}
        <div className="lg:col-span-4">
          <form
            onSubmit={handleUpload}
            className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Slider Title"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />

            <div
              onClick={() => fileRef.current.click()}
              className="relative flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              {preview ? (
                <img
                  src={preview}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto mb-2 text-zinc-400" />
                  <p className="text-xs text-zinc-500">Click to upload image</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileRef}
              onChange={handleFileChange}
              hidden
              accept="image/*"
            />

            <button
              disabled={isUploading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Plus size={18} /> Add Slider
                </>
              )}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AnimatePresence>
              {sliders.map((s) => (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={s._id}
                  className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-40 w-full rounded-lg object-cover"
                  />

                  <div className="mt-2 flex items-center justify-between px-1">
                    <span className="text-sm font-medium dark:text-zinc-200">
                      {s.title}
                    </span>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default Slider;
