import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Badge, Container } from "react-bootstrap";
import axios from "axios";
import "../components/NavbarCustom.css";


const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function NavbarCustom() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Giriş yapmış mı kontrolü için

  let userRole = null;

  if (token) {
    const decodedToken = parseJwt(token);
    console.log("Çözülen Token:", decodedToken);
    if (decodedToken) {
      // Küçük/Büyük harf sorunu olmasın diye hepsini küçültüp alalım
      userRole = decodedToken.role ? decodedToken.role.toLowerCase() : null;
      console.log("Algılanan Rol:", userRole);
    }

    userRole = decodedToken ? decodedToken.role : null;
    // Backend'de claim adı "role" olarak ayarlandı.
  }


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
    <Navbar expand="lg" className="custom-navbar py-3" variant="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="custom-brand">
          🛒 MiniShop
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="nav-link-custom">Ana Sayfa</Nav.Link>

            {!token ? (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom">Giriş Yap</Nav.Link>
                <Button as={Link} to="/register" variant="warning" size="sm" className="ms-2 fw-bold">
                  Kayıt Ol
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/cart" className="nav-link-custom">
                  Sepetim <Badge bg="secondary">New</Badge>
                </Nav.Link>
                <Nav.Link as={Link} to="/orders" className="nav-link-custom">Siparişlerim</Nav.Link>

                <Button variant="danger" size="sm" onClick={handleLogout} className="ms-3">
                  Çıkış
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarCustom;