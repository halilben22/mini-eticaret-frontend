import { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../components/NavbarCustom.css';

// --- EKSİK OLAN PARÇA BU: Token Çözücü ---
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export default function NavbarCustom() {
  const navigate = useNavigate();

  // State'ler
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem("token");

  // Sayfa yüklendiğinde veya token değiştiğinde Rolü bul
  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.role) {
        setUserRole(decoded.role.toLowerCase()); // Büyük/küçük harf sorunu olmasın diye
      }
    } else {
      setUserRole(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload(); // State'leri temizlemek için
  };

  return (
    <Navbar expand="lg" className="custom-navbar py-3" variant="dark">
      <Container>
        {/* LOGO (SOLDA) */}
        <Navbar.Brand as={Link} to="/" className="custom-brand">
          Arella
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* LİNKLER (SAĞDA - ms-auto ile ittik) */}
          <Nav className="ms-auto align-items-center">

            <Nav.Link as={Link} to="/" className="nav-link-custom mx-2">Ana Sayfa</Nav.Link>

            {!token ? (
              <>

                <Nav.Link as={Link} to="/login" className="nav-link-custom mx-2">Giriş Yap</Nav.Link>

                <Button as={Link} to="/register" variant="primary" size="sm" className="ms-2 fw-bold">
                  Kayıt Ol
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/cart" className="nav-link-custom mx-2">
                  Sepetim <Badge bg="light" text="dark" pill>New</Badge>
                </Nav.Link>
                <Nav.Link as={Link} to="/orders" className="nav-link-custom mx-2">Siparişlerim</Nav.Link>

                {/* --- ADMIN BUTONU BURADA --- */}
                {userRole === "admin" && (
                  <Button
                    as={Link}
                    to="/admin"
                    variant="light"
                    size="sm"
                    className="ms-2 fw-bold border-1"
                  >
                    👑 Admin Panel
                  </Button>
                )}
                <span>
                  <strong className="ms-3"></strong>
                </span>

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