import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import Hero from './components/Hero'
import Product from './components/Product/Product'

function App() {
  return (
    <Routes>        
      <Route path="/" element={<Hero />} />
      <Route path="/dashboard" element={<Dashboard />}>
         {/* Nested Routes within Dashboard */}
         <Route path="addProduct" element={<Product />} />
         <Route path="blogPost" element={<p>Blog Post</p>} />
         <Route path="collection" element={<p>collection Post</p>} />
         <Route path="message" element={<p>message Post</p>} />
      </Route>
    </Routes>
  )
}

export default App
