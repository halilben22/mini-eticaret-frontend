
import { BrowserRouter, Routes, Route,Link,useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";


// Basit bir Navbar Bileşeni
function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Giriş yapmış mı kontrolü için

  const handleLogout = async () => {
    if (!token) return;

    try {
      // 1. Backend'e bildir (Bu token'ı yasakla)
      await axios.post("http://localhost:8080/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Backend çıkışı başarılı.");
    } catch (err) {
      console.error("Logout hatası:", err);
      // Backend hata verse bile frontend'den yine de silebiliriz
    }

    // 2. Tarayıcıdan sil
    localStorage.removeItem("token");
    
    // 3. Giriş sayfasına yönlendir ve sayfayı yenile (State temizliği için)
    alert("Çıkış yapıldı 👋");
    window.location.href = "/login"; 
  };

  return (
    <nav style={{ padding: "15px", backgroundColor: "#333", color: "white", display: "flex", gap: "20px", alignItems: "center" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>🏠 Ana Sayfa</Link>
      
      {!token ? (
        <Link to="/login" style={{ color: "white", textDecoration: "none" }}>🔑 Giriş Yap</Link>
      ) : (
        <>
          <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>🛒 Sepetim</Link>
          {/* Çıkış Butonu */}
          <button 
            onClick={handleLogout} 
            style={{ marginLeft: "auto", backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "5px" }}
          >
            Çıkış Yap 🚪
          </button>
        </>
      )}
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