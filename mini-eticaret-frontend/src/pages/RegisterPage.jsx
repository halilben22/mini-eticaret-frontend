import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
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
        <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", background: "#f8f9fa" }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="shadow-lg border-0 rounded-4">
                            <Card.Body className="p-5">

                                {/* Başlık Alanı */}
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold" style={{ color: "#ff6600" }}>Kayıt Ol</h2>
                                    <p className="text-muted small">Aramıza katılmak için formu doldurun</p>
                                </div>

                                <Form onSubmit={handleRegister}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small text-secondary">AD SOYAD</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Adınız Soyadınız"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small text-secondary">EMAIL ADRESİ</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="ornek@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold small text-secondary">ŞİFRE</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="******"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    {/* Kayıt Butonu (Turuncu - Primary) */}
                                    <Button variant="primary" type="submit" className="w-100 py-2 fw-bold shadow-sm mb-3">
                                        HESAP OLUŞTUR
                                    </Button>
                                </Form>

                                {/* Alt Linkler */}
                                <div className="text-center mt-3 pt-3 border-top">
                                    <small className="text-muted">Zaten hesabınız var mı?</small> <br />
                                    <Link to="/login" className="fw-bold text-decoration-none" style={{ color: "#ff6600" }}>
                                        Giriş Yapın
                                    </Link>
                                </div>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}