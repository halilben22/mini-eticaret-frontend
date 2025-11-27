import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/register", { full_name: fullName, email, password });
            toast.success("Kayıt Başarılı! Giriş yapabilirsiniz.");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.error || "Kayıt olunamadı");
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh", background: "#f0f2f5" }}>
            <Container style={{ maxWidth: "450px" }}>
                <Card className="shadow-lg border-0 p-4">
                    <Card.Body>
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-success">Kayıt Ol</h2>
                            <p className="text-muted">Aramıza katılmak için formu doldur</p>
                        </div>

                        <Form onSubmit={handleRegister}>
                            <Form.Group className="mb-3">
                                <Form.Label>Ad Soyad</Form.Label>
                                <Form.Control type="text" placeholder="Adınız Soyadınız" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Şifre</Form.Label>
                                <Form.Control type="password" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </Form.Group>

                            <Button variant="success" type="submit" className="w-100 py-2 fw-bold mb-3">
                                Hesap Oluştur
                            </Button>
                        </Form>

                        <div className="text-center mt-3 border-top pt-3">
                            <small className="text-muted">Zaten hesabın var mı?</small> <br />
                            <Link to="/login" className="fw-bold text-decoration-none text-primary">Giriş Yap</Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}