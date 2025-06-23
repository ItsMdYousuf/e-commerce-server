import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Slider = () => {
  // const { serverUrl } = useContext(ApiContext);
  const serverUrl = "http://localhost:5000";
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [preview, setPreview] = useState("");
  const fileRef = useRef();

  useEffect(() => {
    fetchSliders();
  }, []);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const fetchSliders = async () => {
    try {
      const res = await fetch(`${serverUrl}/sliders`);
      setSliders(await res.json());
    } catch (err) {
      toast.error("Failed to load sliders");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !image) return toast.error("Title and image required");

    const form = new FormData();
    form.append("title", title);
    form.append("sliderImage", image);

    try {
      const res = await fetch(`${serverUrl}/sliders`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const newSlider = await res.json();
      setSliders((prev) => [...prev, newSlider]);
      toast.success("Uploaded");
      setTitle("");
      setImage(null);
      fileRef.current.value = "";
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
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
    <div className="p-6">
      <form
        method="post"
        onSubmit={handleUpload}
        className="space-y-4"
        enctype="multipart/form-data"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2"
        />
        <input
          name="sliderImage"
          type="file"
          ref={fileRef}
          accept="image/*"
          className="w-full border p-2"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImage(file);
              setPreview(URL.createObjectURL(file));
            }
          }}
        />
        <button type="submit" className="bg-blue-500 px-4 py-2 text-white">
          Upload
        </button>
      </form>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sliders.map(({ _id, title, image }) => (
          <div
            key={_id}
            className="relative overflow-hidden rounded bg-white shadow"
          >
            <img
              src={`${serverUrl}${image}`}
              alt={title}
              className="h-48 w-full object-cover"
            />
            <div className="p-2 text-center font-semibold">{title}</div>
            <button
              onClick={() => handleDelete(_id)}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Slider;
