
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import NavbarCustom from "./components/NavbarCustom";
import PaymentPage from "./pages/PaymentPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductDetailPage from "./pages/ProductDetailPage";
import RegisterPage from "./pages/RegisterPage";
import AddProductPage from "./pages/admin/AddProductPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <NavbarCustom />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* --- SADECE GİRİŞ YAPANLAR (Customer & Admin) --- */}


          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />


          {/* --- SADECE ADMİNLER --- */}

          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/add-product" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
export default App;