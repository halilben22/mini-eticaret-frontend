
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";

// Basit bir Navbar Bileşeni
function Navbar() {
  return (
    <nav style={{ padding: "15px", backgroundColor: "#333", color: "white", display: "flex", gap: "20px" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>🏠 Ana Sayfa</Link>
      <Link to="/login" style={{ color: "white", textDecoration: "none" }}>🔑 Giriş Yap</Link>
      <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>🛒 Sepetim</Link>
    </nav>
  );
}

function App() {
return(  
  <BrowserRouter>
<Navbar />
  <Routes>
  <Route path="/" element={<HomePage/>}/>
  <Route path="/login" element={<LoginPage/>}/>
<Route path="/cart" element={<CartPage />} />
  </Routes>
  </BrowserRouter>
  );
}
export default App;