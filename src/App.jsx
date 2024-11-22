import { Route, Routes } from "react-router-dom";

import Dashboard from './components/Dashboard/Dashboard';
import DashboardHome from './components/Dashboard/DashboardHome'; // Default Dashboard Content
import Hero from './components/Hero';
import Product from './components/Product/Product';

function App() {
  return (
   
      <Routes>
        {/* Root Route */}
        <Route path="/" element={<Hero />} />

        {/* Dashboard Layout with Nested Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Default Content */}
          <Route index element={<DashboardHome />} />
          <Route path="addProduct" element={<Product />} />
          <Route path="blogPost" element={<p>Blog Post</p>} />
          <Route path="collection" element={<p>Collection Post</p>} />
          <Route path="message" element={<p>Message Post</p>} />
        </Route>
      </Routes> 
  );
}

export default App;
