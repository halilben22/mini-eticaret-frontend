import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/login", { email, password });
      localStorage.setItem("token", response.data.token);
      toast.success("Hoş geldiniz! 👋");
      navigate("/");
    } catch (err) {
      toast.error("Giriş başarısız! Bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh", background: "#f0f2f5" }}>
      <Container style={{ maxWidth: "450px" }}>
        <Card className="shadow-lg border-0 p-4">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">Giriş Yap</h2>
              <p className="text-muted">Devam etmek için hesabınıza girin</p>
            </div>

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email Adresi</Form.Label>
                <Form.Control type="email" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Şifre</Form.Label>
                <Form.Control type="password" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3">
                Giriş Yap
              </Button>
            </Form>

            <div className="text-center mt-3 border-top pt-3">
              <small className="text-muted">Hesabınız yok mu?</small> <br />
              <Link to="/register" className="fw-bold text-decoration-none">Hemen Kayıt Ol</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}