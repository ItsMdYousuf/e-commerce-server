import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ServerURL } from "../../SeerverDepen";

const SingleBlog = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${ServerURL}/products/${postId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => setPost(data))
      .catch((error) => {
        console.error(error);
        setError("Failed to load post");
      });
  }, [postId]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!post) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="p-4">
      <Link
        to="/dashboard/blogPost"
        className="mb-4 inline-block text-blue-500 hover:underline"
      >
        &larr; Back to Blog
      </Link>
      <h2 className="mb-2 text-2xl font-bold">{post.productTitle}</h2>
      <p className="mb-4 text-gray-600">${post.productAmount}</p>
      <p className="text-gray-800">{post.productDescription}</p>
    </div>
  );
};

export default SingleBlog;
