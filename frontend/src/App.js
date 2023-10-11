import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./screens/Welcome";
import SignInUpForm from "./screens/SignInUpForm";
import Home from "./screens/Home";
import Products from "./screens/Products";
import Orders from "./screens/Orders";
import Resources from "./screens/Resources";
import Login from "./screens/Login";
import Register from "./screens/Register";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/homepage" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
