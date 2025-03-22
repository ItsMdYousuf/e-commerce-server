import { Route, Routes } from "react-router-dom";

import Blog from "./components/Blog/Blog";
import SingleBlog from "./components/Blog/SingleBlog";
import CategoryManager from "./components/Category/CategoryManager";
import Dashboard from "./components/Dashboard/Dashboard";
import DashboardHome from "./components/Dashboard/DashboardHome"; // Default Dashboard Content
import Hero from "./components/Hero";
import Order from "./components/Order/Order";
import EditProduct from "./components/Product/EditProduct";
import ManageProducts from "./components/Product/ManageProducts";
import Product from "./components/Product/Product";
import ProductView from "./components/Product/ProductView";
import Slider from "./components/Slider";
function App() {
  return (
    <Routes>
      {/* Root Route */}
      <Route path="/" element={<Hero />} />

      {/* Dashboard Layout with Nested Routes */}
      <Route path="/dashboard" element={<Dashboard />}>
        {/* Default Content */}
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
    </Routes>
  );
}

export default App;
