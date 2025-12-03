import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Badge, Spinner, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("http://localhost:8080/admin/orders", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://localhost:8080/admin/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Durum güncellendi: ${newStatus}`);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            toast.error("Güncelleme başarısız!");
        }
    };

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

    if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

    return (
        <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white py-3">
                <h5 className="mb-0 fw-bold text-secondary">📋 Sipariş Listesi ({orders.length})</h5>
            </Card.Header>
            <Card.Body className="p-0">
                <div className="admin-table-scroll" style={{ maxHeight: "500px", overflowY: "auto" }}>
                    <Table responsive hover striped className="mb-0 align-middle">
                        <thead className="bg-light sticky-top" style={{ top: 0, zIndex: 1 }}>
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Müşteri ID</th>
                                <th>Tutar</th>
                                <th>Durum</th>
                                <th>İşlem</th>
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
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        <Form.Select
                                            size="sm"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{ maxWidth: "180px", cursor: "pointer" }}
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
                </div>
            </Card.Body>
        </Card>
    );
}