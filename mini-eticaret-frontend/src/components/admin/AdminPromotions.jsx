import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Card, Form, Button, Table, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function AdminPromotions() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newPromo, setNewPromo] = useState({
        code: "",
        type: "percentage",
        value: 0,
        min_order_amount: 0
    });

    const fetchPromotions = useCallback(async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("http://localhost:8080/admin/promotions", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPromotions(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            await axios.post("http://localhost:8080/admin/promotions", {
                code: newPromo.code,
                discount_type: newPromo.type,
                discount_value: parseFloat(newPromo.value),
                min_order_amount: parseFloat(newPromo.min_order_amount)
            }, { headers: { Authorization: `Bearer ${token}` } });

            toast.success("Kampanya oluşturuldu! 🎉");
            setNewPromo({ code: "", type: "percentage", value: 0, min_order_amount: 0 });
            fetchPromotions();
        } catch (err) {
            toast.error("Oluşturulamadı");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Silmek istediğine emin misin?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:8080/admin/promotions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.info("Silindi");
            setPromotions(promotions.filter(p => p.id !== id));
        } catch (err) { toast.error("Hata"); }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <Row>
            {/* SOL: Ekleme */}
            <Col md={4} className="mb-4">
                <Card className="shadow-sm border-0">
                    <Card.Header className="bg-white fw-bold py-3 text-primary">✨ Yeni Kupon Ekle</Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleCreate}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Kod</Form.Label>
                                <Form.Control type="text" placeholder="Örn: YAZ20" value={newPromo.code} onChange={e => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Tip</Form.Label>
                                <Form.Select value={newPromo.type} onChange={e => setNewPromo({ ...newPromo, type: e.target.value })}>
                                    <option value="percentage">Yüzde (%)</option>
                                    <option value="fixed_amount">Sabit Tutar (TL)</option>
                                    <option value="free_shipping">Kargo Bedava</option>
                                </Form.Select>
                            </Form.Group>
                            {newPromo.type !== 'free_shipping' && (
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Değer</Form.Label>
                                    <Form.Control type="number" value={newPromo.value} onChange={e => setNewPromo({ ...newPromo, value: e.target.value })} />
                                </Form.Group>
                            )}
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Min Sepet Tutarı</Form.Label>
                                <Form.Control type="number" value={newPromo.min_order_amount} onChange={e => setNewPromo({ ...newPromo, min_order_amount: e.target.value })} />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 fw-bold">Oluştur</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>

            {/* SAĞ: Liste */}
            <Col md={8}>
                <Card className="shadow-sm border-0">
                    <Card.Header className="bg-white fw-bold py-3">🏷️ Aktif Kampanyalar</Card.Header>
                    <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                        <Table hover responsive className="mb-0 align-middle">
                            <thead className="bg-light sticky-top" style={{ top: 0 }}>
                                <tr>
                                    <th>Kod</th>
                                    <th>Tip</th>
                                    <th>Değer</th>
                                    <th>Alt Limit</th>
                                    <th>İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promotions.map(promo => (
                                    <tr key={promo.id}>
                                        <td className="fw-bold text-primary">{promo.code}</td>
                                        <td>
                                            {promo.discount_type === 'percentage' && <Badge bg="info">%</Badge>}
                                            {promo.discount_type === 'fixed_amount' && <Badge bg="secondary">TL</Badge>}
                                            {promo.discount_type === 'free_shipping' && <Badge bg="success">Kargo</Badge>}
                                        </td>
                                        <td>{promo.discount_value}</td>
                                        <td>{promo.min_order_amount} TL</td>
                                        <td><Button size="sm" variant="outline-danger" onClick={() => handleDelete(promo.id)}>Sil</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </Col>
        </Row>
    );
}