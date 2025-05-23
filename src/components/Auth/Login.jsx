// Login.jsx
import { auth } from "@/Firebase/Firebase.init";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function Login() {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const getFriendlyMessage = (error) => {
    if (!error || !error.code) return "Something went wrong. Please try again.";
    switch (error.code) {
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/email-already-in-use":
        return "Email already in use.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      default:
        return error.message || "Something went wrong. Please try again.";
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // for redirecting to dashboard after login
  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [userInfo, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetSuccess(false);

    if (!resetEmail) {
      setError("Please enter your email to reset password.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(getFriendlyMessage(err));
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setShowReset(false);
    setResetEmail("");
    setResetSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { email, password, username } = formData;

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(userCredential.user, {
          displayName: username,
        });
      }
      const user = userCredential.user;
      setUserInfo({
        name: user.displayName || username,
        email: user.email,
      });
      setLoading(false);
    } catch (err) {
      setError(getFriendlyMessage(err));
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUserInfo({
        name: user.displayName,
        email: user.email,
      });
      setLoading(false);
    } catch (err) {
      setError(getFriendlyMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-center text-2xl font-bold">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {userInfo ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-green-600">
              Welcome, {userInfo.name}
            </p>
            <p className="text-gray-700">{userInfo.email}</p>
          </div>
        ) : (
          <>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!showReset ? (
              <>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {!isLogin && (
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Your username"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Your password"
                      required
                    />
                    <p
                      onClick={() => setShowReset(true)}
                      className="mt-2 inline-block cursor-pointer text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </p>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="text-blue-600 hover:underline"
                  >
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </p>

                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Please wait..." : "Sign in with Google"}
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                {resetSuccess && (
                  <p className="text-center text-sm text-green-600">
                    Check your email for the reset link!
                  </p>
                )}
                <p
                  onClick={() => {
                    setShowReset(false);
                    setResetEmail("");
                    setError("");
                    setResetSuccess(false);
                  }}
                  className="mt-4 cursor-pointer text-center text-sm text-blue-600 hover:underline"
                >
                  Back to {isLogin ? "Login" : "Sign Up"}
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
