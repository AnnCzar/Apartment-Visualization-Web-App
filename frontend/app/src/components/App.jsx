import React, {useEffect} from "react";
import Home from "../pages/Home";
import Product from "../pages/Product";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

    useEffect(() => {
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
}, []);



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
