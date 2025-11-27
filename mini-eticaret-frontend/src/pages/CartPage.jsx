import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Spinner, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  const fetchCart = () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    axios.get("http://localhost:8080/cart", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        const items = response.data.data.items || [];
        setCartItems(items);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => { fetchCart(); }, []);

  const handleCheckout = async () => {
    if (!address) { toast.warning("Lütfen adres girin!"); return; }
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:8080/create-order",
        { shipping_address: address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order_id, total } = response.data;
      navigate("/payment", { state: { orderId: order_id, totalAmount: total } });

    } catch (error) {
      toast.error(error.response?.data?.error || "Hata oluştu");
    }
  };

  // Sepet Toplamı
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-secondary">🛒 Sepetim ({cartItems.length} Ürün)</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5 bg-white rounded shadow-sm">
          <h3 className="text-muted">Sepetinizde ürün yok. 😔</h3>
          <Button as={Link} to="/" variant="primary" className="mt-3">Alışverişe Başla</Button>
        </div>
      ) : (
        <Row>
          {/* --- SOL TARA: ÜRÜN LİSTESİ --- */}
          <Col lg={8}>
            {cartItems.map((item) => (
              <Card key={item.id} className="mb-3 border-0 shadow-sm">
                <Card.Body>
                  <Row className="align-items-center">
                    {/* Resim */}
                    <Col xs={4} md={2}>
                      <Image
                        src={item.product.image_url ? `http://localhost:8080${item.product.image_url}` : "https://via.placeholder.com/150"}
                        fluid rounded
                        style={{ height: "80px", objectFit: "cover" }}
                      />
                    </Col>

                    {/* Bilgiler */}
                    <Col xs={8} md={6}>
                      <h6 className="mb-1 text-truncate">
                        <Link to={`/product/${item.product_id}`} className="text-decoration-none text-dark">
                          {item.product.name}
                        </Link>
                      </h6>
                      <small className="text-muted">Birim Fiyat: {item.product.price} ₺</small>
                    </Col>

                    {/* Adet ve Toplam (Mobilde alt satıra geçebilir) */}
                    <Col xs={12} md={4} className="mt-3 mt-md-0 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center border rounded px-2">
                        <small className="fw-bold me-2">Adet:</small>
                        <span>{item.quantity}</span>
                      </div>
                      <span className="fw-bold text-primary fs-5">
                        {(item.product.price * item.quantity).toFixed(2)} ₺
                      </span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* --- SAĞ TARA: SİPARİŞ ÖZETİ (Sticky) --- */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm sticky-top" style={{ top: "100px" }}>
              <Card.Header className="bg-white fw-bold py-3">Sipariş Özeti</Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Ara Toplam</span>
                  <span>{totalPrice.toFixed(2)} ₺</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-success">
                  <span>Kargo</span>
                  <span>Bedava</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
                  <span>Toplam</span>
                  <span className="text-primary">{totalPrice.toFixed(2)} ₺</span>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">Teslimat Adresi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Adresinizi giriniz..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ resize: "none" }}
                  />
                </Form.Group>

                <Button variant="success" size="lg" className="w-100 fw-bold" onClick={handleCheckout}>
                  Sepeti Onayla ✅
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}