import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Image, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal ve Düzenleme State'leri
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: "", price: "", stock_quantity: "", description: "", category_id: "1", image: null
    });

    // Ürünleri Çek
    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:8080/products");
            setProducts(res.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    // SİLME İŞLEMİ
    const handleDelete = async (id) => {
        if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:8080/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Ürün silindi");
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            toast.error("Silinemedi!");
        }
    };

    // DÜZENLEME MODALINI AÇ
    const handleEditClick = (product) => {
        setEditId(product.id);
        setFormData({
            name: product.name,
            price: product.price,
            stock_quantity: product.stock_quantity,
            description: product.description,
            category_id: product.category_id,
            image: null // Resmi sıfırla (yeni yüklenirse değişir)
        });
        setShowModal(true);
    };

    // GÜNCELLEME İŞLEMİ (SUBMIT)
    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        // FormData oluştur (Dosya yükleme ihtimali olduğu için)
        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("stock_quantity", formData.stock_quantity);
        data.append("description", formData.description);
        data.append("category_id", formData.category_id);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            await axios.put(`http://localhost:8080/products/${editId}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Ürün güncellendi!");
            setShowModal(false);
            fetchProducts(); // Listeyi tazele
        } catch (err) {
            toast.error("Güncelleme başarısız");
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <>
            <div className="admin-table-scroll bg-white p-3 rounded shadow-sm">
                <Table hover responsive className="align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th>Resim</th>
                            <th>Ürün Adı</th>
                            <th>Fiyat</th>
                            <th>Stok</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <Image
                                        src={p.image_url ? `http://localhost:8080${p.image_url}` : "https://via.placeholder.com/50"}
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                        rounded
                                    />
                                </td>
                                <td className="fw-bold">{p.name}</td>
                                <td className="text-primary fw-bold">{p.price} ₺</td>
                                <td>
                                    {p.stock_quantity > 0 ?
                                        <Badge bg="success">{p.stock_quantity} Adet</Badge> :
                                        <Badge bg="danger">Tükendi</Badge>
                                    }
                                </td>
                                <td>
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditClick(p)}>
                                        Düzenle
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(p.id)}>
                                        Sil
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* --- DÜZENLEME MODALI --- */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ürünü Düzenle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ürün Adı</Form.Label>
                            <Form.Control type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fiyat (TL)</Form.Label>
                            <Form.Control type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stok</Form.Label>
                            <Form.Control type="number" value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Açıklama</Form.Label>
                            <Form.Control as="textarea" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </Form.Group>

                        {/* Kategori Seçimi (Opsiyonel, manuel listeledik) */}
                        <Form.Group className="mb-3">
                            <Form.Label>Kategori ID</Form.Label>
                            <Form.Select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                                <option value="1">Elektronik</option>
                                <option value="2">Giyim</option>
                                <option value="3">Kitap</option>
                                <option value="4">Ev & Yaşam</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Resim Değiştir (Opsiyonel)</Form.Label>
                            <Form.Control type="file" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>İptal</Button>
                            <Button variant="success" type="submit">Güncelle</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}