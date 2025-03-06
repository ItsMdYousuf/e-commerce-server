import { Route, Routes } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard";
import DashboardHome from "./components/Dashboard/DashboardHome"; // Default Dashboard Content
import Hero from "./components/Hero";
import ManageProducts from "./components/Product/ManageProducts";
import Product from "./components/Product/Product";
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
        <Route path="products/manageProducts" element={<ManageProducts />} />
        <Route path="category" element={<p>Category page.</p>} />
        <Route path="blogPost" element={<p>Blog Post</p>} />
        <Route path="collection" element={<p>Collection Post</p>} />
        <Route path="message" element={<p>Message Post</p>} />
      </Route>
    </Routes>
  );
}

export default App;
