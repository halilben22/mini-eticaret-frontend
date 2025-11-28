import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function AddProductPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State'leri
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [categoryId, setCategoryId] = useState("1"); // Varsayılan kategori 1
    const [image, setImage] = useState(null);

    // Kategori Listesi (Gerçek hayatta backend'den çekilebilir ama şimdilik manuel)
    const categories = [
        { id: 1, name: "Elektronik" },
        { id: 2, name: "Giyim" },
        { id: 3, name: "Kitap" },
        { id: 4, name: "Ev & Yaşam" }
    ];

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Yetkisiz erişim!");
            navigate("/login");
            return;
        }

        // FORM-DATA Hazırlığı (Resim yüklemek için şart)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock_quantity", stock);
        formData.append("category_id", categoryId);
        if (image) {
            formData.append("image", image); // Backend 'image' anahtarını bekliyor
        }

        try {
            await axios.post("http://localhost:8080/admin/add-product", formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data" // ÇOK ÖNEMLİ!
                }
            });

            toast.success("Ürün başarıyla eklendi! 🎉");
            navigate("/admin"); // İş bitince panele dön

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Ürün eklenemedi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5" style={{ maxWidth: "600px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-secondary">Yeni Ürün Ekle</h2>
                <Button as={Link} to="/admin" variant="outline-secondary" size="sm">Geri Dön</Button>
            </div>

            <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>Ürün Adı</Form.Label>
                            <Form.Control type="text" placeholder="Örn: Kablosuz Kulaklık" value={name} onChange={e => setName(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Açıklama</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Ürün detayları..." value={description} onChange={e => setDescription(e.target.value)} />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fiyat (TL)</Form.Label>
                                    <Form.Control type="number" step="0.01" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stok Adedi</Form.Label>
                                    <Form.Control type="number" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Kategori</Form.Label>
                                    <Form.Select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ürün Resmi</Form.Label>
                                    <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mt-3" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : "Ürünü Kaydet ✅"}
                        </Button>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}