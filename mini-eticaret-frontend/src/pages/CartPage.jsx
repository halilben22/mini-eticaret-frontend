import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Spinner, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CartSkeleton from "../components/skeletons/CartSkeleton";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adres State'i
  const [addrForm, setAddrForm] = useState({
    city: "",
    district: "",
    detail: ""
  });

  // YENİ: Promosyon Kodu State'i
  const [promoCode, setPromoCode] = useState("");

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

        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => { fetchCart(); }, []);

  const handleCheckout = async () => {
    // 1. Adres Validasyonu (Boş mu?)
    if (!addrForm.city || !addrForm.district || !addrForm.detail) {
      toast.warning("Lütfen adres bilgilerini tam giriniz!");
      return;
    }

    const combinedAddress = `${addrForm.detail}, ${addrForm.district} / ${addrForm.city}`;
    const token = localStorage.getItem("token");

    try {
      // 2. Backend İsteği (Promo Code ile)
      const response = await axios.post("http://localhost:8080/create-order",
        {
          shipping_address: combinedAddress,
          promo_code: promoCode // <--- YENİ: Kodu gönderiyoruz
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Gelen Detaylı Verileri Al
      const { order_id, total, sub_total, shipping, discount_amount } = response.data;

      // 4. Ödeme Sayfasına Taşı
      navigate("/payment", {
        state: {
          orderId: order_id,
          totalAmount: total,
          subTotal: sub_total, // Fiş detayı için
          shipping: shipping,
          discount: discount_amount
        }
      });

    } catch (error) {
      toast.error(error.response?.data?.error || "Hata oluştu");
    }
  };

  // Sepet Toplamı (Sadece ürünlerin toplamı, indirim öncesi)
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) return <CartSkeleton />

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-secondary">Sepetim ({cartItems.length} Ürün)</h2>

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

                    {/* Adet ve Toplam */}
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
                  <span>Alıcı Ödemeli (Hesaplanacak)</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
                  <span>Toplam</span>
                  {/* Buradaki toplam henüz indirim düşülmemiş ham toplamdır */}
                  <span className="text-primary">{totalPrice.toFixed(2)} ₺</span>
                </div>

                {/* --- ADRES FORMU --- */}
                <div className="mb-3">
                  <Form.Label className="small fw-bold text-muted">Teslimat Adresi</Form.Label>

                  <Row className="mb-2">
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="İl"
                        value={addrForm.city}
                        onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="İlçe"
                        value={addrForm.district}
                        onChange={(e) => setAddrForm({ ...addrForm, district: e.target.value })}
                      />
                    </Col>
                  </Row>

                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Mahalle, Sokak, Bina No, Daire..."
                    value={addrForm.detail}
                    onChange={(e) => setAddrForm({ ...addrForm, detail: e.target.value })}
                    style={{ resize: "none" }}
                  />
                </div>

                {/* --- YENİ: KUPON KODU ALANI --- */}
                <div className="mb-4">
                  <Form.Label className="small fw-bold text-muted">İndirim Kuponu</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Kupon Kodu (Opsiyonel)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())} // Otomatik büyük harf
                  />
                  <Form.Text className="text-muted small">
                    *İndirim ödeme ekranında düşecektir.
                  </Form.Text>
                </div>
                {/* ------------------------------- */}

                <Button variant="success" size="lg" className="w-100 fw-bold" onClick={handleCheckout}>
                  Siparişi Onayla
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}