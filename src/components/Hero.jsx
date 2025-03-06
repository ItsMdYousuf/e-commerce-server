import { useState } from "react";
import { Link } from "react-router-dom"; // Make sure you have react-router-dom installed

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess(false);

    // Basic validation
    if (!email || !password) {
      setError(
        "🛑 Hold up! Both email and password are required. Don't leave us hanging! 🛑",
      );
      return;
    }

    // Check credentials (demo only - never do this in production!)
    if (email === "fuck@gmail.com" && password === "1234") {
      setSuccess(true);
    } else {
      setError(
        "🤔 Oops! Wrong email or password. Did you forget your secret handshake? 🤷‍♂️",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      {success ? (
        // Dashboard Section
        <div className="text-center">
          <h1 className="mb-8 text-6xl font-bold text-purple-600">
            🎉 Welcome! 🎉
          </h1>
          <p className="mb-8 text-xl text-gray-700">
            Ready to rule the world? Let's go! 🚀
          </p>
          <Link
            to="/dashboard" // Update this to your actual dashboard route
            className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-12 py-6 text-2xl font-bold text-white shadow-lg transition-all hover:scale-110 hover:from-pink-500 hover:to-purple-500"
          >
            🚀 Go to Dashboard 🚀
          </Link>
        </div>
      ) : (
        // Login Form
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
        >
          <h1 className="mb-6 text-center text-3xl font-bold text-purple-600">
            Welcome Back! 🎈
          </h1>

          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border-2 border-gray-200 p-3 transition-all focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border-2 border-gray-200 p-3 transition-all focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 px-6 py-3 font-bold text-white transition-all hover:bg-purple-700"
          >
            Let Me In! 🚪
          </button>
        </form>
      )}
    </div>
  );
}
