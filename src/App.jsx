import { Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import SingUp from "./components/Auth/SingUp";
import Blog from "./components/Blog/Blog";
import SingleBlog from "./components/Blog/SingleBlog";
import CategoryManager from "./components/Category/CategoryManager";
import { useAuth } from "./components/Context/AuthContext";
import Dashboard from "./components/Dashboard/Dashboard";
import DashboardHome from "./components/Dashboard/DashboardHome";
import Hero from "./components/Hero";
import Order from "./components/Order/Order";
import PrivateRoute from "./components/PrivateRoute";
import EditProduct from "./components/Product/EditProduct";
import ManageProducts from "./components/Product/ManageProducts";
import Product from "./components/Product/Product";
import ProductView from "./components/Product/ProductView";
import Slider from "./components/Slider";

function App() {
  const { loading } = useAuth(); // must provide loading in context

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/singup" element={<SingUp />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Hero />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="slider" element={<Slider />} />
          <Route path="products" element={<p>Products page.</p>} />
          <Route path="products/addNewProduct" element={<Product />} />
          <Route
            path="products/manageProducts/:productId"
            element={<ProductView />}
          />
          <Route path="products/manageProducts" element={<ManageProducts />} />
          <Route path="products/edit/:productId" element={<EditProduct />} />
          <Route path="order" element={<Order />} />
          <Route path="category" element={<CategoryManager />} />
          <Route path="blogPost" element={<Blog />} />
          <Route path="blogPost/:postId" element={<SingleBlog />} />
          <Route path="collection" element={<p>Collection Post</p>} />
          <Route path="message" element={<p>Message Post</p>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
