import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Table, Form, Badge, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total_orders: 0, total_revenue: 0 });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Verileri çekme
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) { navigate("/login"); return; }

            try {
                // Paralel istek atalım (Daha hızlı yüklenmesi için)
                const [statsRes, ordersRes] = await Promise.all([
                    axios.get("http://localhost:8080/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("http://localhost:8080/admin/orders", { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setStats(statsRes.data);
                setOrders(ordersRes.data.data);
                setLoading(false);

            } catch (err) {
                console.error("Yetki hatası:", err);
                toast.error("Bu sayfaya erişim yetkiniz yok!");
                navigate("/");
            }
        };

        fetchData();
    }, [navigate]);

    // Durum Güncelleme
    const handleStatusChange = async (orderId, newStatus) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://localhost:8080/admin/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(`Sipariş #${orderId} durumu güncellendi: ${newStatus}`);

            // Listeyi güncelle
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            toast.error("Güncelleme başarısız!");
        }
    };

    // Duruma Göre Renkli Badge Döndüren Yardımcı Fonksiyon
    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid': return <Badge bg="success">Ödendi ✅</Badge>;
            case 'shipped': return <Badge bg="info" text="dark">Kargolandı 🚛</Badge>;
            case 'delivered': return <Badge bg="primary">Teslim Edildi 📦</Badge>;
            case 'waiting_payment': return <Badge bg="warning" text="dark">Ödeme Bekliyor ⏳</Badge>;
            case 'cancelled': return <Badge bg="danger">İptal ❌</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Panel verileri yükleniyor...</p>
        </Container>
    );

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">👮‍♂️ Admin Paneli</h2>
                <Badge bg="dark" className="p-2">Admin Modu</Badge>
            </div>

            {/* --- İSTATİSTİK KARTLARI --- */}
            <Row className="mb-5 g-4">
                {/* Ciro Kartı */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100 text-white" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                        <Card.Body className="text-center d-flex flex-column justify-content-center p-4">
                            <h5 className="text-white-50 text-uppercase letter-spacing-1">Toplam Ciro</h5>
                            <h1 className="display-4 fw-bold mb-0">
                                {stats.total_revenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                            </h1>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Sipariş Sayısı Kartı */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100 text-white" style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}>
                        <Card.Body className="text-center d-flex flex-column justify-content-center p-4">
                            <h5 className="text-white-50 text-uppercase letter-spacing-1">Toplam Sipariş</h5>
                            <h1 className="display-4 fw-bold mb-0">
                                {stats.total_orders} <span className="fs-4">Adet</span>
                            </h1>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* --- SİPARİŞ TABLOSU --- */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white py-3">
                    <h5 className="mb-0 fw-bold text-secondary">📋 Son Siparişler</h5>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover striped className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Müşteri ID</th>
                                <th>Tutar</th>
                                <th>Durum</th>
                                <th>İşlem (Durum Değiştir)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="ps-4 fw-bold">#{order.id}</td>
                                    <td className="text-muted">User-{order.user_id}</td>
                                    <td className="fw-bold text-primary">
                                        {order.total_amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                    </td>
                                    <td>
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td>
                                        <Form.Select
                                            size="sm"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{ maxWidth: "180px", cursor: "pointer" }}
                                            className="shadow-sm border-secondary"
                                        >
                                            <option value="waiting_payment">Ödeme Bekliyor</option>
                                            <option value="paid">Ödendi</option>
                                            <option value="shipped">Kargolandı</option>
                                            <option value="delivered">Teslim Edildi</option>
                                            <option value="cancelled">İptal</option>
                                        </Form.Select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
                {orders.length === 0 && (
                    <div className="text-center p-5 text-muted">
                        Henüz sipariş bulunmuyor.
                    </div>
                )}
            </Card>
        </Container>
    );
}