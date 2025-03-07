import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ServerURL } from "../../SeerverDepen";

const Blog = () => {
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    fetch(ServerURL + "/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setBlog(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Blog Posts</h2>
      <div className="space-y-4">
        {blog.map((item) => (
          <div className="rounded-lg border p-4" key={item.id}>
            <h3 className="text-xl font-semibold">{item.productTitle}</h3>
            <p className="text-gray-600">${item.productAmount}</p>
            <Link
              to={`/dashboard/blogPost/${item._id}`}
              className="mt-2 inline-block text-blue-500 hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
