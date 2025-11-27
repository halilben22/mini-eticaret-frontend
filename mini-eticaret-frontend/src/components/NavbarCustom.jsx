import { useState } from 'react'; // State ekle
import { Navbar, Container, Nav, Button, Badge, Form } from 'react-bootstrap'; // Form ekle
import { Link, useNavigate, useLocation } from 'react-router-dom'; // useLocation ekle
import '../components/NavbarCustom.css'; // CSS dosyasını içe aktar

export default function NavbarCustom() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation(); // Şu anki sayfa adresi

  // Arama metni için state
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Arama Yapılınca Çalışacak Fonksiyon
  const handleSearch = (e) => {
    e.preventDefault(); // Sayfa yenilenmesin
    // URL'i güncelle: /?name=aranan_kelime
    navigate(`/?name=${searchTerm}`);
  };

  return (
    <Navbar expand="lg" className="custom-navbar py-3" variant="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="custom-brand">
          🛒 MiniShop
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">

          {/* --- YENİ EKLENEN KISIM: ARAMA KUTUSU --- */}
          {/* Sadece Ana Sayfada ("/") isek göster */}
          {location.pathname === "/" && (
            <Form className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: "900px", width: "100%" }} onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Ürün ara..."
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-light" type="submit">Ara</Button>
            </Form>
          )}
          {/* ---------------------------------------- */}

          <Nav className={location.pathname === "/" ? "ms-0" : "ms-auto"}>
            <Nav.Link as={Link} to="/" className="nav-link-custom mx-2">Ana Sayfa</Nav.Link>

            {!token ? (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom mx-2">Giriş Yap</Nav.Link>
                <Button as={Link} to="/register" variant="warning" size="sm" className="ms-2 fw-bold">
                  Kayıt Ol
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/cart" className="nav-link-custom mx-2">
                  Sepetim <Badge bg="light" text="dark" pill>New</Badge>
                </Nav.Link>
                <Nav.Link as={Link} to="/orders" className="nav-link-custom mx-2">Siparişlerim</Nav.Link>

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