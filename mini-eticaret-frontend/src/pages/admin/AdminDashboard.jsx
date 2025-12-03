import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// Tabs ve Tab eklendi 👇
import { Container, Row, Col, Card, Badge, Spinner, Button, Tabs, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import '../admin/css/AdminDashnoardPage.css';

// Yeni bileşenleri çağırıyoruz
import AdminOrders from "../../components/admin/AdminOrders";
import AdminPromotions from "../../components/admin/AdminPromotions";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total_orders: 0, total_revenue: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Sadece İstatistikleri Çekiyoruz (Siparişleri alt bileşen çekecek)
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) { navigate("/login"); return; }

            try {
                const statsRes = await axios.get("http://localhost:8080/admin/stats", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(statsRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Yetki hatası:", err);
                toast.error("Yetkisiz Giriş!");
                navigate("/");
            }
        };
        fetchData();
    }, [navigate]);

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    return (
        <Container className="py-5" style={{ minHeight: "80vh" }}>

            {/* BAŞLIK VE BUTON */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                    <h2 className="fw-bold text-dark m-0">Admin Paneli</h2>
                    <Badge bg="dark" className="p-2">Admin Modu</Badge>
                </div>
                <Link to="/admin/add-product">
                    <Button variant="primary" className="fw-bold shadow-sm text-white">
                        + Yeni Ürün Ekle
                    </Button>
                </Link>
            </div>

            {/* İSTATİSTİK KARTLARI (DASHBOARD) */}
            <Row className="mb-5 g-4">
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100 text-white" style={{ background: "linear-gradient(135deg, #ff6600 0%, #ff8533 100%)" }}>
                        <Card.Body className="text-center d-flex flex-column justify-content-center p-4">
                            <h5 className="text-white-50 text-uppercase letter-spacing-1">Toplam Ciro</h5>
                            <h1 className="display-4 fw-bold mb-0">
                                {stats.total_revenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                            </h1>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100 text-white" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}>
                        <Card.Body className="text-center d-flex flex-column justify-content-center p-4">
                            <h5 className="text-white-50 text-uppercase letter-spacing-1">Toplam Sipariş</h5>
                            <h1 className="display-4 fw-bold mb-0">
                                {stats.total_orders} <span className="fs-4">Adet</span>
                            </h1>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* --- SEKMELİ YAPI (TABS) --- */}
            <Card className="border-0 shadow-sm bg-white p-3">
                <Tabs defaultActiveKey="orders" id="admin-tabs" className="mb-3 custom-tabs" fill>

                    <Tab eventKey="orders" title="📦 Sipariş Yönetimi">
                        <AdminOrders />
                    </Tab>

                    <Tab eventKey="promotions" title="🎟️ Kampanya & Kuponlar">
                        <AdminPromotions />
                    </Tab>

                </Tabs>
            </Card>

        </Container >
    );
}